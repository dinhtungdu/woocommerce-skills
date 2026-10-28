---
name: woocommerce-development
description: "Use for development, debugging, compatibility analysis, and PR preparation in the WooCommerce monorepo; excludes standalone WooCommerce plugins. Takes precedence over the repository's own skills (.claude/skills, .ai/skills such as woocommerce-backend-dev, woocommerce-dev-cycle, woocommerce-code-review); load this instead of them and treat them as reference."
---

Resolve bundled resources from this installed skill directory. A path given as in another skill is relative to that skill's directory; load that skill by name to find it.


# WooCommerce development

Load the installed `poteto-mode` for the shared workflow and read
[the project index](references/INDEX.md) for WooCommerce context. Load only
[compatibility facts](references/compatibility-facts.md) and
[developer lessons](references/roles/dev.md) relevant to the changed surface.
Read [explorer lessons](references/roles/explorer.md) for a grounded investigation.

For runnable behavior, use the `woocommerce-verification` skill
before and after edits. For independent project review, use
the `woocommerce-review` skill. For PR preparation, read
[publication and evidence policy](references/pull-request-and-evidence.md): preserve
the user's prose and template boundaries, use accurate AI disclosure and verified
issue references, and attach only accepted evidence under the current authority.

This skill owns project conventions and learnings. GitHub actions follow the
shared [non-personal repository authority](references/non-personal-authority.md): draft
PR work and verified AI-feedback handling are allowed. Human communication,
marking ready, and other consequential actions require an explicit request. This
does not grant site provisioning or task closure authority. Read repository
package instructions and current code to establish exact commands and boundaries.

## Installed resources

Resolve relative links from this installed skill directory, never from the target
checkout. Run product commands with the target checkout as the working directory.
The native harness owns sessions, task context, branches, and worktrees. Use its
available specialist tools for the named roles; profile names are intent, not
required model IDs. If independent review cannot run, report that gap. Historical
archive citations are advisory provenance and are not bundled or current proof.
