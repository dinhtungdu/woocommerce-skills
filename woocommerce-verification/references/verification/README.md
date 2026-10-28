
# Verify WooCommerce

For live-site checks, use only the site assigned to the current task worktree. Read the development context (`references/INDEX.md` in the `woocommerce-development` skill) first; it owns current environment, authentication, and safety rules. For browser evidence, also read [`../browser-evidence.md`](../browser-evidence.md) and reuse [`../browser-harness/README.md`](../browser-harness/README.md) when its recording contract applies. For automated-test-only work, follow the repository instructions below without browser-site setup or doctor.

## Native entry point

Set `WOO_VERIFICATION_DIR` to the absolute directory of the installed `woocommerce-verification/SKILL.md` supplied by the harness (the parent directory, not the Markdown file).
Use the bundled entry point from the globally installed skill:

```bash
woo-control() { python3 "$WOO_VERIFICATION_DIR/references/verification/verify" "$@"; }
```

The entry point requires explicit environment details from the machine-local
setup skill and an explicit browser for doctor/run. Read the
[environment contract](../worktree/README.md), resolve the assigned site with that
local skill, and export `WOO_CONTROL_SITE_URL` and `WOO_CONTROL_SITE_DIR`.
Doctor verifies the plugin symlink targets the current checkout. Verification
does not provision or choose a service stack; a URL does not prove availability.
Use the local setup's ownership and collision checks before reusing or recreating
fixtures. Preserve accepted evidence through cleanup.

## When required

- Issue implementation: capture the reported behavior before implementation, repeat the same path after implementation, and rerun after behavior-changing review corrections.
- Pull-request review: when the diff changes runnable behavior, verify the exact reviewed PR head before approval and rerun after behavior-changing updates. Compare the target-branch baseline only when the regression or claim requires it.
- Non-runnable code, tests, documentation, or metadata-only changes: record why live verification is not applicable instead of inventing a user path.
- Start with the smallest existing focused check that proves the changed behavior. If standard focused setup cannot run, report the blocker instead of building custom infrastructure.

## Run automated tests

Follow the target checkout's `AGENTS.md` and relevant repository skills for all
automated test setup and execution, including PHPUnit, JavaScript, and E2E tests.
For WooCommerce, start with `.ai/skills/woocommerce-dev-cycle/SKILL.md` and its
linked test guidance. Load any additional skills required by the repository.
Use the current package scripts from that exact checkout. Do not duplicate test
commands here or build custom automated-test infrastructure.

Before the first PHPUnit run, preflight the repository-supported test
environment: confirm the WordPress test library and test database exist, using
the repository's own setup. If either is missing, install it through that setup
before running tests rather than discovering it mid-review. Keep the disposable
test database separate from the retained live-store database.

For E2E, run only tests covering the affected area locally. Leave the full E2E
suite to CI. Report which tests ran and any gaps; a focused pass is not a
full-suite result.

Our custom tooling covers live verification and the running store only. Use the
machine-local setup skill for that store, not `wp-env`. Use `wp-env` for automated
tests only when the repository's test instructions require it. Do not use the
live store or its database as an automated-test fixture.

Retain the test command, full tested revision, uncommitted changes exercised, and
test result. Report setup blockers rather than silently switching test stacks.
Apply the regression-test procedure below when claiming regression coverage.

## Prove regression tests discriminate

Apply this procedure to risky changed behavior, including test-only changes that
claim regression coverage. Do not require mutations for every function or add a
blanket mutation-testing framework. Test-only work can skip a live user path, but
must still prove the regression test distinguishes correct behavior from a bug.

1. For filter or range regressions, create otherwise eligible fixtures that the
   changed predicate must include and exclude. Keep other predicates from hiding
   its effect. Assert the exact expected identities, derived from the contract,
   not the implementation. Assert order only when order is part of the contract.
   Counts, nonempty results, and an included product alone do not prove exclusion.
2. Run the focused test normally through the relevant consumer, such as a real
   WordPress query for query filtering. Preserve its passing output.
3. Temporarily disable the relevant behavior in that executed path without
   changing the test, fixtures, or expectations. Run the same test, with one
   mutation at a time. Where a plausible boundary mistake applies, test it
   separately, such as decimal truncation or an inclusive comparison changed to
   an exclusive comparison. Otherwise, record why no boundary mutation applies.
4. Require each mutation to fail on the intended behavioral assertion. Inspect
   the expected and actual identities. Syntax, setup, and unrelated failures are
   not proof. If the test passes or fails elsewhere, repair the fixture or check
   and repeat the procedure before claiming coverage.
5. Restore every temporary mutation, including hooks and environment overrides,
   even after failed checks. Compare with the pre-mutation state without erasing
   existing work. Rerun the unchanged test and require it to pass again. Use only
   task-owned disposable test state within the existing authorization.
6. Record the full tested revision, tested uncommitted changes, test command and
   case, fixture identities and boundaries, and each mutation's exact change.
   Retain normal, mutated, and restored outputs with the intended assertion and
   observed result. Record restoration checks. Rerun on a changed revision rather
   than relabeling older evidence. Report unavailable execution as a coverage gap.

In [PR #68870](https://github.com/woocommerce/woocommerce/pull/68870), a decimal
maximum test caught truncation but passed with maximum filtering disabled because
all fixtures satisfied its `15.28` maximum. The corrected `10.28` maximum includes
the `10.25` product and excludes the existing `15` product. Bypassing the filter
adds the excluded identity; truncating the maximum to `10` loses the decimal
identity. Both must fail the same exact-identity assertion that passes normally.
A repaired fixture protects that case. Future reviews still need this evidence
for the risky behavior they claim to cover.

## Launch

From the exact task worktree, resolve the assigned administrator URL:

```bash
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" site-url
```

If the assigned site does not exist, report the missing setup. Verification does
not provision; use the machine-local setup skill when authorized. Never use another task's site.

## Doctor

Run the read-only preflight from the task worktree:

```bash
woo-control doctor --browser playwright
```

It checks the selected browser, explicit site details and availability, and the task plugin symlink. Site or plugin failures are hard stops; never use another task's site. If only the local browser fails, report the blocker; use host Chrome only when a fallback is necessary, with `woo-control doctor --browser chrome` first. Do not silently switch browsers.

## Feature Map

Read [`features/README.md`](features/README.md), then only the live-verified entry or matching entry from [`features/test-verified/README.md`](features/test-verified/README.md) covering the issue. The map describes stable user entry points and proof surfaces; the issue still defines exact assertions.

When a successful test or live verification exposes a missing or stale map entry, reduce the matching test entry to the behavior actually proved; run the test harvester below first only when current tests changed or no matching entry exists. Write the complete proposal under `tmp/verification/feature-map/` using the four headings `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>`, and `Gotchas`; include the proposed README row and cite the exact-revision passing test or accepted live evidence. Keep issue-specific selectors, fixtures, and conclusions in task artifacts. The task owner applies only evidence-backed project map updates within scope and records their provenance. Shared-skill changes are proposed first. A passing test verifies only its asserted behavior; use assigned-site verification for visual or manual behavior, mocks, environment-specific behavior, or claims outside those assertions.

## Drive

- Run `woo-control list` for available baseline recipes. For Shop/archive work, run `woo-control run shop --evidence tmp/verification/shop --browser playwright` only when the assigned site's Shop archive resolves at `/shop/` and its product links use `/product/`. The current recipe hardcodes both paths. On plain-permalink sites, drive the archive at `/?post_type=product` and follow the rendered product link with Playwright; do not report the CLI recipe as passed. Do not require Shop preflight for unrelated work, including Mini-Cart checks that can start from an existing storefront product.
- Use Playwright Chromium for issue-specific wp-admin, editor, and storefront behavior not covered by a `woo-control` recipe. Use the exact assigned site URL; Choose native Chrome/CDP when it serves the required proof and access is available.
- Authenticate locally with the credentials and recovery guidance in the machine-local setup skill; keep browser storage state task-local and out of accepted artifacts. Use a browser session only within the task's existing authority.
- Prefer accessible roles, labels, block names, routes, and observable state over generated selectors.
- Capture the action and resulting state. For persisted behavior, also verify the underlying REST response, saved entity, database state, or subsequent reload when persistence is in scope.
- Use WP-CLI or HTTP directly for CLI/API behavior, but do not substitute internal setters for the user-facing path being proved.

## Evidence

Before implementation, preserve one baseline artifact that demonstrates the reported behavior. After implementation and review corrections, repeat the same path and capture the changed outcome plus relevant console, network, response, or state evidence.

Stage task-local evidence under `tmp/verification/`, then copy accepted, sanitized outputs into the task's `artifacts/` with a unique evidence directory and record their provenance. `woo-control run` writes screenshots, a browser trace, diagnostics, assertions, and `result.json` there. For UI behavior, preserve at least one screenshot showing the asserted outcome and its supporting result. For CLI/API-only behavior, preserve command/response and assertion evidence; a UI screenshot is not required. Report accepted artifact names and what they prove so they can be used in PR preparation. A passing test suite without live behavior evidence does not complete a runnable issue.

Record the full tested Git SHA, identify any uncommitted changes exercised, and
associate each accepted artifact with that revision, assigned site, user path,
and assertion. Preserve relevant automated check outputs alongside live feature
evidence; the Shop/product smoke is only a baseline and does not prove an
unrelated changed feature. Repeat affected checks after behavior-changing edits.

For UI work, open the captured screenshots and assess the visible outcome,
including relevant layout, text, and controls. Record which images were opened,
what their visual assessment established, and any limitations. Redact credentials,
authentication state, and unrelated private data before retaining evidence for PR
use. Do not claim an implementation check passed from a screenshot alone. Report
exact blockers and explain why live checks or screenshots are inapplicable for
non-runnable changes. Reviewers inspect the actual artifacts and revision.

## Helpers

Generate deterministic test-backed map candidates from WooCommerce Playwright specs:

```bash
node "$WOO_VERIFICATION_DIR/references/verification/helpers/feature-map-harvest.mjs" \
  --repo "$PWD" \
  --output tmp/verification/feature-map-candidates
```

The output contains `README.md`, `manifest.json`, and one entry per test feature group. It refuses a non-empty output directory. Task leads omit `--verified-ref` unless they have exact-revision passing evidence. The task owner may generate a canonical trunk index with `--verified-ref <full-ci-gated-sha>`; those entries verify exactly what their cited tests assert. Use assigned-site evidence only for visual/manual behavior, mocks, environment differences, or claims outside those assertions.

Run the helper self-check after changing it:

```bash
node "$WOO_VERIFICATION_DIR/references/verification/helpers/test-feature-map-harvest.mjs"
```

## Cleanup

Restore only state created or changed by the verification run. Keep accepted evidence. Never kill processes by name, remove another task's site, or reset shared fixture data. Report any surface that could not be exercised and the exact blocker.
