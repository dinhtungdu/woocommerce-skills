---
name: woocommerce-verification
description: "Verifies WooCommerce monorepo behavior with repository tests and assigned-site checks; records polished real-browser demo videos with HyperFrames. Use for verification, screencasts and demo recording. Excludes standalone plugin setup. Takes precedence over the repository's own skills (.claude/skills, .ai/skills such as woocommerce-backend-dev, woocommerce-dev-cycle, woocommerce-code-review); load this instead of them and treat them as reference."
---

Resolve bundled resources from this installed skill directory. A path given as in another skill is relative to that skill's directory; load that skill by name to find it.


# WooCommerce verification

Set `WOO_VERIFICATION_DIR` to the absolute directory containing this installed
`SKILL.md`, using the path supplied by the harness. Keep the working directory
in the exact target WooCommerce checkout. Read
[the verification guide](references/verification/README.md), then only the relevant
feature map entry. Development context and review live in the sibling
`woocommerce-development` and
`woocommerce-review` skills.

For automated tests, follow [the repository-owned workflow](references/verification/README.md#run-automated-tests).
The target checkout's instructions own test setup and commands. Custom tooling
here is only for live verification and the running store. Do not use `wp-env`
for development or the live store. Automated-test-only work does not require
the browser driver or an assigned browser site.

For live-site verification, read [the environment contract](references/worktree/README.md) and the machine-local
setup skill supplied by the harness (for example `woocommerce-test-store-setup`).
Use it to provide explicit site URL and WordPress directory settings before
verification. It owns provisioning, credentials, ownership and cleanup. Check
exclusive task use and preserve source, user data and evidence before recreating
owned disposable fixtures. Doctor still validates the exact checkout binding.

```sh
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" list
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" site-url
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" doctor --browser playwright
```

Exercise the actual changed feature; the
bundled Shop/product smoke alone does not verify another feature. Record the full
tested revision and identify tested uncommitted changes. For UI work, open the
captured screenshots, assess the visible result, and report what they establish
and what remains untested. Retain sanitized outputs for PR use and report skips
or blockers explicitly.

Capture the same user path before and after behavior changes; preserve accepted,
sanitized evidence in the current harness. Keep browser state local. Never use
another checkout's site or report unavailable integration behavior as passed.

For demo videos, follow [the recording workflow](references/recording-video.md)
and [browser-evidence runbook](references/browser-evidence.md). Capture real input
and assertions, then finish with readable framing and action-aligned captions.
Retain raw proof separately; inspect the exported motion before delivery.

## Installed resources

Resolve relative links from this installed skill directory, never from the target
checkout. Run product commands with the target checkout as the working directory.
The native harness owns sessions, task context, branches, and worktrees. Use its
available specialist tools for the named roles; profile names are intent, not
required model IDs. If independent review cannot run, report that gap. Historical
archive citations are advisory provenance and are not bundled or current proof.
