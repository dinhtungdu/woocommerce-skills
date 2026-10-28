# WooCommerce browser-evidence runbook

Task-owner-curated, advisory knowledge for WooCommerce pull-request browser evidence. Current task intent, the live site, repository instructions, and direct browser evidence remain authoritative.

## Routing and evidence ownership

- Reuse applicable primitives and follow the evidence contract in [browser-harness/README.md](browser-harness/README.md). Final recording requires a persisted passing preflight; each recording attempt retains bounded metrics in task-local evidence and the native task completion report.
- Use a separate scoped helper with the bundled [recording workflow](recording-video.md) for the initial recording and a real evidence-only retry. Do not launch a helper for tiny wording iterations: settle concise contributor copy with the user first, freeze it in canonical task intent, then expand and execute once.
- PR How to test contains only contributor-needed product setup, actions, assertions, limitations, and cleanup. Authentication, backups, hashes, request classification, recording, and harness mechanics belong only in this internal runbook and evidence artifacts.
- Helpers stage files only under task-local `tmp/prepare-pr/`. The lead inspects and ingests accepted outputs through task-scoped the harness's accepted evidence workflow using flat artifact names.
- Load the relevant verified guidance below into the helper prompt. Helpers propose reusable guidance updates; the task owner reviews them before promotion.

## Environment and safety

- Reuse the environment assigned by the machine-local setup skill. Confirm exclusive task use; never drive another task's site.
- Check installed browser capabilities and assigned-site reachability on the current host before choosing a route. Prefer isolated headless Playwright Chromium when it can perform the required assertions and recording; do not require a specific host or an MCP adapter. If unavailable or unable to perform the check, use an available host browser/CDP route and record the failed capability check and fallback chosen. Missing capabilities are a blocker, not permission to install tools or provision services. Host Chrome over CDP accepts an isolated Playwright 1440×900 `recordVideo` context; close that context before reading `video.path()`. Verified lesson; 6/6 result.
- Resolve the assigned wp-admin URL with the machine-local setup skill, export its explicit URL and WordPress directory, then run `verify site-url`. Use its authorized credentials access and the browser route established by the capability check. Keep authentication state task-local and out of evidence.
- Authenticate before recording. Keep Playwright storage state task-local; a signed-in host browser route need not use a Playwright storage-state file. Never record credentials or ingest authentication files.
- A freshly provisioned task site may redirect the baseline administrator login through WordPress `confirm_admin_email`. During non-recorded authentication, choose **Remind me later**, then persist storage state only after the authenticated destination loads.
- For variation bulk-action evidence, open the Variations tab before checking rows. The native action control can be hidden by enhanced UI: wait for attachment, not visibility. Use a structural predicate for ledger array assertions, including empty diagnostics, because its default comparator is identity. Evidence: accepted 11/11 preflight.
- Before showing a pass banner or proof screenshot for an expanded variation, scroll the asserted price field into view. Evidence: accepted recording lessons.
- Preserve the user's current template structure and surrounding content. Prefer the shortest sequential happy path in realistic editor and storefront context; use an isolated fixture only when the task explicitly requires it. Never invent a fixture matrix, language change, or site mutation for broader-looking evidence.
- Capture internally the original state actually mutated by testing and restore only that state. Do not copy backup, hash, or harness mechanics into contributor instructions unless the contributor must perform them.

## WordPress and WooCommerce patterns

- Confirm the exact Site Editor/template variant, active theme, block hierarchy, and frontend product before writing final selectors.
- Product Catalog List View labels the WooCommerce breadcrumbs block **Store Breadcrumbs**. Use that display title when asserting representative surrounding template content, while still dry-running it against the assigned site.
- Select the intended parent block through Document Overview/List View when clicking canvas content could select an inner block. Verify the selected block name before manipulating inspector controls.
- A fresh temporary administrator may receive the Site Editor **Edit your site** welcome dialog before Save becomes actionable. Wait for either the dialog or Save; dismiss the dialog when present, then wait for Save.
- Prefer accessible roles, labels, block names, and asserted state over generated class names, database IDs, or brittle DOM ancestry.
- Treat template IDs, nesting under Group blocks, inspector menus, and experimental control labels as version- and theme-sensitive. Dry-run them against the assigned site rather than copying stale selectors.
- Ignored generated block assets can lag current source and serve a stale schema despite a clean task HEAD. Before full preflight, compare generated assets with HEAD source; when stale, run `pnpm --filter @woocommerce/block-library build`, then rerun the complete preflight. Never adapt final assertions to stale generated output.
- Wait for explicit save completion when saving is required to expose frontend behavior, then verify the expected frontend wrapper state and captured browser/network error results. Do not add a dedicated reload/persistence pass unless persistence itself changed, a realistic regression risk requires it, or the user explicitly requested it. When only one template entity is dirty, the Site Editor may POST it directly without opening a confirmation panel; start waiting for that POST before clicking Save, require HTTP 200, and verify the Saving label returns to Save. At responsive boundaries, geometry can settle before CSS color transitions; wait for the expected computed style instead of sleeping. Do not use long arbitrary delays as proof.
- For Product Filters custom-viewport evidence on WordPress 7.1, temporarily merge `settings.viewport.mobile` and `settings.viewport.tablet` into the active theme settings, reload the storefront, assert rendered CSS and computed layout immediately at both sides of each boundary, then restore the theme bytes.
- After narrow frontend checks, restore the editor viewport (normally 1440×900) before returning to Site Editor. Responsive navigation may hide the complementary Settings panel; after List View selection, reopen the accessible Settings control when the block inspector is absent.
- For a visible overlay backdrop whose production wrapper owns closing, first use `elementFromPoint` at a visibly unobscured backdrop coordinate and assert it resolves to the expected wrapper. Click that point with a real pointer and assert close; separately click an inert point inside the dialog and assert it remains open. Do not infer hit targeting from color or DOM ancestry alone.
- For full-template evidence, assert representative surrounding blocks before modification, after any save required to expose frontend behavior, and after reset; proving only the target wrapper is insufficient context-preservation evidence. Reload only when the persistence rule above requires it.
- Capture baseline hashes for every mutated template and Global Styles record, then require byte-identical restoration, target-block presence, surrounding-block preservation, and temporary-user deletion in a cleanup result.
- Site Editor navigation can cancel in-flight WordPress REST `OPTIONS` or `HEAD` requests. Record these separately as expected navigation cancellations only when they coincide with controlled navigation; never suppress unrelated request failures.
- Controlled cleanup reload may abort an in-flight variation `admin-ajax` request after restoration. Record that cancellation separately; do not suppress other request failures. Evidence: accepted preflight diagnostics.
- For review-avatar evidence, change Avatar Display through authenticated **Settings → Discussion**, save because the frontend reads that setting, then check frontend markup; restore and reverify the original setting afterward. Reload and assert persisted checkbox state only when persistence itself is in scope, a realistic regression risk requires it, or the user explicitly requests it.
- If irrelevant wp-admin telemetry or 26px/32px default-avatar preview requests destabilize evidence, fulfill only those exact requests locally. Leave product-review avatars on their real frontend path and assert them directly; never suppress broader request failures.
- Unauthenticated REST template requests may return authorization failures; browser evidence should use the authenticated Playwright context instead of inferring template state from anonymous `curl` responses.

## Polished demo recording

Follow the bundled [recording workflow and HyperFrames template](recording-video.md).
It owns capture pacing, cursor feedback, finishing commands and exported-motion
acceptance. Keep project assertions, environment safety and evidence ownership in
this runbook; do not duplicate the recording technique here.

## Continuous learning artifact

Create `tmp/prepare-pr/recording-lessons.json` before exploration and update it throughout the run. Use failure categories and phase metrics defined by [browser-harness/README.md](browser-harness/README.md); preserve them on failed runs too. Each entry contains:

```json
{
  "id": "stable-kebab-case",
  "scope": "run | project | general",
  "observation": "What happened",
  "cause": "Verified cause or unknown",
  "fix": "Confirmed procedure or unresolved",
  "evidence": ["assertion, screenshot, result field, or command outcome"],
  "status": "candidate | verified"
}
```

Do not store credentials, absolute slot-specific paths, unsupported guesses, or transient noise. Preserve partial lessons on failure. The final artifact manifest includes lessons, preflight results, recording metrics, reusable Playwright harness, results, media, and PR description.

## Promotion rule

The task owner inspects accepted lessons and promotes only verified, reusable project facts into this runbook. Promote reusable code into `browser-harness/` only when exact result evidence proves it and it removes repeated work; never promote generated selectors or task branches. The three-run contract trial is complete; its comparison is recorded in `browser-harness/trials.json`, and no further runs are appended. Run-specific details remain immutable task artifacts. Cross-project patterns require a separately reviewed global skill update; the recording skill never edits itself.
