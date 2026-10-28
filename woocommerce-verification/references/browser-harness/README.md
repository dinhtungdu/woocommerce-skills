# WooCommerce browser-evidence harness

Small reusable primitives and evidence contract for pull-request browser testing. Copy or require [`index.cjs`](index.cjs) from task-local harness code; never write task outputs here.

## Required evidence sequence

1. Read current canonical Objective, Constraints, Acceptance, and frozen concise test lines.
2. Translate only that scope into assertions.
3. Dry-run without video and write `tmp/prepare-pr/preflight-results.json`.
4. Start final recording only after `requirePassedPreflight()` accepts that file.
5. Write results, media, lessons, and `recording-metrics.json` even on failure.
6. Retain `summarizeMetrics(metrics)` unchanged in task-local evidence and the concise native task completion report.

No recording to discover selectors. No unsupported assertion survives preflight. No task hostname, credentials, storage state, generated selectors, or run-specific fixtures enter this directory.

## Preflight result

```json
{
  "schema_version": 1,
  "ok": true,
  "assertions": [{ "id": "editor-control-visible", "status": "PASS" }],
  "rejected_assertions": [
    { "id": "focus-restoration", "reason": "Not implemented or required by current canonical scope." }
  ],
  "failure_category": "none"
}
```

Preflight covers current-code assertion validity, assigned-site/auth availability, selector resolution, required state, mutation/cleanup scope, and expected recording viewports. Rejected assertions are useful: they measure false requirements removed before recording.

## Recording metrics

Write `tmp/prepare-pr/recording-metrics.json`:

```json
{
  "schema_version": 1,
  "started_at": "2026-08-13T10:00:00.000Z",
  "completed_at": "2026-08-13T10:10:00.000Z",
  "instruction_revisions": 0,
  "preflight_failures": 0,
  "recording_attempts": 1,
  "elapsed_ms": 600000,
  "reused_primitives": ["createLedger", "attachPageDiagnostics", "showBanner", "requirePassedPreflight"],
  "available_primitives": 7,
  "rejected_assertions": 0,
  "failure_category": "none",
  "rework_events": [
    { "category": "selector", "reason": "Reopened Site Editor Settings after responsive navigation hid inspector." }
  ],
  "phase_ms": {
    "preflight": 180000,
    "recording": 360000,
    "media-validation": 60000
  }
}
```

Failure category is one of:

- `none`
- `stale-task-brief`
- `unsupported-assertion`
- `selector-navigation`
- `environment-auth`
- `instruction-ambiguity`
- `product-regression`
- `recording-media`
- `cleanup`

Completion-report metrics line format is exactly `Evidence metrics: elapsed Nmin; revisions N; preflight failures N; recording attempts N; rework N; reused N/N; assertions rejected N.`

`started_at` and `completed_at` are actual UTC wall-clock boundaries; `elapsed_ms` must equal their difference. `phase_ms` records drafting/setup, preflight, recording, media validation, and cleanup time where applicable; its sum cannot exceed elapsed time, leaving unclassified overhead honest rather than fabricated. `instruction_revisions` counts revisions after frozen concise copy reaches recorder. `preflight_failures` counts failed complete dry runs. `recording_attempts` counts final video starts. `rework_events` records each unplanned intervention with category `instruction`, `selector`, `environment-auth`, `site-state`, `recording-media`, `cleanup`, or `other` plus a concrete reason. `reused_primitives` names project harness exports actually used. `rejected_assertions` counts assertions removed before final recording because current code or canonical scope did not support them.

Do not invent an effort score. Wall-clock time, phase time, retries, revisions, rejected assertions, primitive reuse, and categorized rework are observable and comparable. Model tokens, cost, generated line count, and subjective difficulty are excluded because they are poor proxies for producing accepted evidence.

## Lesson promotion

Run artifacts remain immutable. The task owner may promote code here only when exact result evidence verifies reuse and helper removes repeated work. Prefer extending an existing primitive. Do not promote task-specific selectors or workflow branches.

The completed three-run comparison is recorded in [`trials.json`](trials.json). Do not append further runs to the trial ledger.
