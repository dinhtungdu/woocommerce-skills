---
name: woocommerce-review
description: "Review WooCommerce monorepo changes for concrete regressions, extension compatibility, test gaps, and exact-revision evidence; use alongside the shared review playbook. Takes precedence over the repository's own skills (.claude/skills, .ai/skills such as woocommerce-backend-dev, woocommerce-dev-cycle, woocommerce-code-review); load this instead of them and treat them as reference."
---

Resolve bundled resources from this installed skill directory. A path given as in another skill is relative to that skill's directory; load that skill by name to find it.


# WooCommerce review

In the assigned checkout, verify the PR's actual source branch/current head;
report the verified branch/HEAD and any detached state. Pin the exact head,
base, intent, and changed boundary. Read the
installed `interrogate` skill and its
`references/reviewer-prompt.md`, resolved from that skill's installed directory,
then [WooCommerce reviewer lessons](references/roles/reviewer.md). Use
development context (`references/INDEX.md` in the `woocommerce-development` skill) and
compatibility facts (`references/compatibility-facts.md` in the `woocommerce-development` skill)
only for the changed surface.

For runnable changes, judge the evidence against
the `woocommerce-verification` skill on the exact
reviewed revision. Require the smallest live user path that distinguishes failure
from success. Verify extension-facing hooks and data through actual consumers
when relevant. Tests must catch distinct changed-boundary regressions; audit
fixtures, globals, and assertions as strictly as production code.

Before a verdict on runnable changes, prove the PR live on the assigned retained
store. In plain words, state the user-visible issue and what the PR claims to
fix, from its description and linked issue. Then run the same real user path
(browser, editor, or HTTP) and data on the exact base and the current head, plus
a control case that could fail. Show the problem on base and the fix on head
with captured evidence. Reproduce any finding live to the same standard. Passing
tests alone are not this proof. Keep the proof inside the PR's stated scope.

For risky regression coverage, require the
discriminating regression proof (`references/verification/README.md#prove-regression-tests-discriminate` in the `woocommerce-verification` skill),
including for test-only changes. Put this requirement in independent review
briefs and require reviewers to return the tested revision, normal and mutated
assertion evidence, and restoration result. Inspect that evidence before a clean
verdict. Missing proof is a coverage gap; a surviving mutation is a test-coverage
finding. Do not give an unqualified clean review with either unresolved. Improving
a fixture alone does not satisfy this review requirement.

Inspect actual check outputs and accepted artifacts for the tested revision,
including identified uncommitted changes. For UI changes, open the screenshots
and assess whether they prove the visible outcome; flag stale, missing, or
non-probative evidence. Screenshots do not replace automated checks or verify
uncaptured feature behavior.

Return actionable findings with stable IDs, location, execution path, impact, and
evidence; reconcile findings after updates. A clean result is valid. Agent
verdicts remain advisory. Publishing a GitHub review or human-directed comment requires an explicit
request. Verified AI-only feedback replies on the task's own PR follow the shared
non-personal repository authority (`references/non-personal-authority.md` in the `woocommerce-development` skill) and
the installed `poteto-mode` skill's `playbooks/babysit.md`. Missing code, tools, consumers, or site access are gaps.

## Installed resources

Resolve relative links from this installed skill directory, never from the target
checkout. Run product commands with the target checkout as the working directory.
The native harness owns sessions, task context, branches, and worktrees. Use its
available specialist tools for the named roles; profile names are intent, not
required model IDs. If independent review cannot run, report that gap. Historical
archive citations are advisory provenance and are not bundled or current proof.
