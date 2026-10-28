'use strict';

const assert = require( 'node:assert/strict' );
const {
	FAILURE_CATEGORIES,
	createLedger,
	requirePassedPreflight,
	summarizeMetrics,
	validateMetrics,
} = require( './index.cjs' );

const ledger = createLedger();
ledger.check( 'equal', 2, 2 );
ledger.rejectBeforeRecording( 'unsupported', 'Absent from current code.' );
assert.equal( ledger.assertions[ 0 ].status, 'PASS' );
assert.equal( ledger.rejectedBeforeRecording.length, 1 );
assert.throws( () => ledger.check( 'different', 2, 3 ), /different/ );

assert.equal( requirePassedPreflight( {
	schema_version: 1,
	ok: true,
	assertions: [ { id: 'ready', status: 'PASS' } ],
} ).ok, true );
assert.throws( () => requirePassedPreflight( { schema_version: 1, ok: false, assertions: [] } ), /passing preflight/ );

const metrics = {
	schema_version: 1,
	started_at: '2026-08-13T10:00:00.000Z',
	completed_at: '2026-08-13T10:10:10.000Z',
	instruction_revisions: 1,
	preflight_failures: 2,
	recording_attempts: 1,
	elapsed_ms: 610000,
	reused_primitives: [ 'createLedger', 'showBanner' ],
	available_primitives: 7,
	rejected_assertions: 3,
	failure_category: 'none',
	rework_events: [ { category: 'selector', reason: 'Reopened hidden editor inspector.' } ],
	phase_ms: { preflight: 200000, recording: 410000 },
};
assert.equal( validateMetrics( metrics ), metrics );
assert.equal( summarizeMetrics( metrics ),
	'Evidence metrics: elapsed 10min; revisions 1; preflight failures 2; recording attempts 1; rework 1; reused 2/7; assertions rejected 3.' );
assert.throws( () => validateMetrics( { ...metrics, elapsed_ms: 600000 } ), /elapsed_ms/ );
assert.throws( () => validateMetrics( { ...metrics, failure_category: 'fantasy' } ), /failure_category/ );
assert.ok( FAILURE_CATEGORIES.has( 'unsupported-assertion' ) );

console.log( 'OK: WooCommerce browser harness validates preflight and bounded recording metrics' );
