'use strict';

const fs = require( 'node:fs' );

const FAILURE_CATEGORIES = new Set( [
	'none',
	'stale-task-brief',
	'unsupported-assertion',
	'selector-navigation',
	'environment-auth',
	'instruction-ambiguity',
	'product-regression',
	'recording-media',
	'cleanup',
] );
const REWORK_CATEGORIES = new Set( [
	'instruction', 'selector', 'environment-auth', 'site-state', 'recording-media', 'cleanup', 'other',
] );
const UTC_TIMESTAMP = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/;

function createLedger() {
	const assertions = [];
	const rejectedBeforeRecording = [];

	function check( id, expected, actual, predicate = ( value, wanted ) => value === wanted ) {
		const passed = Boolean( predicate( actual, expected ) );
		assertions.push( { id, status: passed ? 'PASS' : 'FAIL', expected, actual } );
		if ( ! passed ) {
			throw new Error( `${ id }: expected ${ JSON.stringify( expected ) }, got ${ JSON.stringify( actual ) }` );
		}
	}

	function rejectBeforeRecording( id, reason ) {
		rejectedBeforeRecording.push( { id, reason } );
	}

	return { assertions, rejectedBeforeRecording, check, rejectBeforeRecording };
}

function attachPageDiagnostics( page ) {
	const diagnostics = {
		pageErrors: [],
		consoleErrors: [],
		requestErrors: [],
		navigationCancellations: [],
		httpErrors: [],
	};
	page.on( 'pageerror', error => diagnostics.pageErrors.push( error.message ) );
	page.on( 'console', message => {
		if ( message.type() === 'error' ) diagnostics.consoleErrors.push( message.text() );
	} );
	page.on( 'requestfailed', request => {
		const failure = {
			url: request.url(),
			method: request.method(),
			error: request.failure()?.errorText || 'unknown',
		};
		if ( failure.error === 'net::ERR_ABORTED' ) diagnostics.navigationCancellations.push( failure );
		else diagnostics.requestErrors.push( failure );
	} );
	page.on( 'response', response => {
		if ( response.status() >= 400 ) diagnostics.httpErrors.push( { url: response.url(), status: response.status() } );
	} );
	return diagnostics;
}

async function showBanner( page, text, duration = 3000, color = '#06752f' ) {
	await page.evaluate( ( { bannerText, bannerColor } ) => {
		document.getElementById( 'wc-browser-evidence-banner' )?.remove();
		const element = document.createElement( 'div' );
		element.id = 'wc-browser-evidence-banner';
		element.textContent = bannerText;
		Object.assign( element.style, {
			position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
			zIndex: '2147483647', background: bannerColor, color: '#fff', padding: '12px 18px',
			borderRadius: '7px', font: '600 16px/1.4 sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,.4)',
			maxWidth: '88%', textAlign: 'center',
		} );
		document.body.appendChild( element );
	}, { bannerText: text, bannerColor: color } );
	await new Promise( resolve => setTimeout( resolve, duration ) );
	await page.evaluate( () => document.getElementById( 'wc-browser-evidence-banner' )?.remove() );
}

function requirePassedPreflight( preflight ) {
	if ( ! preflight || preflight.schema_version !== 1 || preflight.ok !== true ||
		! Array.isArray( preflight.assertions ) || preflight.assertions.some( assertion => assertion.status !== 'PASS' ) ) {
		throw new Error( 'Final recording requires a persisted passing preflight.' );
	}
	return preflight;
}

function validateMetrics( metrics ) {
	if ( ! metrics || metrics.schema_version !== 1 ) throw new Error( 'Recording metrics schema_version must be 1.' );
	for ( const key of [ 'instruction_revisions', 'preflight_failures', 'recording_attempts', 'elapsed_ms', 'rejected_assertions' ] ) {
		if ( ! Number.isSafeInteger( metrics[ key ] ) || metrics[ key ] < 0 ) throw new Error( `Invalid recording metric: ${ key }` );
	}
	if ( ! UTC_TIMESTAMP.test( metrics.started_at ?? '' ) || ! UTC_TIMESTAMP.test( metrics.completed_at ?? '' ) ) {
		throw new Error( 'started_at and completed_at must be UTC timestamps.' );
	}
	if ( Date.parse( metrics.completed_at ) - Date.parse( metrics.started_at ) !== metrics.elapsed_ms ) {
		throw new Error( 'elapsed_ms must equal completed_at minus started_at.' );
	}
	if ( metrics.recording_attempts < 1 ) throw new Error( 'recording_attempts must be at least 1.' );
	if ( ! Array.isArray( metrics.reused_primitives ) || metrics.reused_primitives.some( value => typeof value !== 'string' || ! value ) ) {
		throw new Error( 'reused_primitives must contain non-empty names.' );
	}
	if ( ! Number.isSafeInteger( metrics.available_primitives ) || metrics.available_primitives < metrics.reused_primitives.length ) {
		throw new Error( 'available_primitives conflicts with reused_primitives.' );
	}
	if ( ! FAILURE_CATEGORIES.has( metrics.failure_category ) ) throw new Error( 'Unknown failure_category.' );
	if ( ! metrics.phase_ms || typeof metrics.phase_ms !== 'object' || Array.isArray( metrics.phase_ms ) ||
		Object.values( metrics.phase_ms ).some( value => ! Number.isSafeInteger( value ) || value < 0 ) ) {
		throw new Error( 'phase_ms must contain non-negative integer durations.' );
	}
	if ( Object.values( metrics.phase_ms ).reduce( ( total, value ) => total + value, 0 ) > metrics.elapsed_ms ) {
		throw new Error( 'phase_ms cannot exceed elapsed_ms.' );
	}
	if ( ! Array.isArray( metrics.rework_events ) || metrics.rework_events.length > 100 || metrics.rework_events.some( event =>
		! event || typeof event !== 'object' || Array.isArray( event ) ||
		Object.keys( event ).sort().join( ',' ) !== 'category,reason' || ! REWORK_CATEGORIES.has( event.category ) ||
		typeof event.reason !== 'string' || ! event.reason.trim() || event.reason.length > 240 ) ) {
		throw new Error( 'rework_events must contain bounded categorized unplanned work.' );
	}
	return metrics;
}

function summarizeMetrics( rawMetrics ) {
	const metrics = validateMetrics( rawMetrics );
	const minutes = Math.max( 1, Math.round( metrics.elapsed_ms / 60000 ) );
	return `Evidence metrics: elapsed ${ minutes }min; revisions ${ metrics.instruction_revisions }; preflight failures ${ metrics.preflight_failures }; recording attempts ${ metrics.recording_attempts }; rework ${ metrics.rework_events.length }; reused ${ metrics.reused_primitives.length }/${ metrics.available_primitives }; assertions rejected ${ metrics.rejected_assertions }.`;
}

function writeJson( path, value ) {
	fs.writeFileSync( path, `${ JSON.stringify( value, null, 2 ) }\n`, { mode: 0o600 } );
}

module.exports = {
	FAILURE_CATEGORIES,
	attachPageDiagnostics,
	createLedger,
	requirePassedPreflight,
	showBanner,
	summarizeMetrics,
	validateMetrics,
	writeJson,
};
