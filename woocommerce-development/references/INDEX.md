# Project context: woocommerce

## Shared workflow

Load the installed `poteto-mode` skill and read the target repository instructions first. The source guidance below retains evidence-backed
project lessons. The native harness owns sessions and notifications; no Manager,
Herdr, automatic task lifecycle, or background scheduler runs here. Tasks select
playbooks directly. Use GitHub and harness chats for task context and results;
Project lessons are advisory evidence.

Historical environment notes below are advisory. Read the shared
environment contract (`references/worktree/README.md` in the `woocommerce-verification` skill)
and the machine-local setup skill for current launch, site resolution, credentials
and cleanup. Verify the assigned checkout; missing
site/browser access is a blocker, not permission to drive another task's site.

Advisory routing index. Current user intent, repository instructions, current harness context and Git remain authoritative. Keep context lean: load only linked guidance relevant to the current changed surface.

## Always

- Standing automation applies to currently assigned WooCommerce issues and direct user review requests only after verifying the current assignment or request plus a concrete user-owned action. Assignment, mention, or notification reason alone creates no task; ignore updates already owned by someone else unless they ask this user for work, review, or a decision.
- Route implementation through the installed pstack playbook and read `references/verification/README.md` in the `woocommerce-verification` skill.
- Use the installed `interrogate` for pull-request review. For runnable behavior, require `references/verification/README.md` in the `woocommerce-verification` skill on the exact PR head; for non-runnable changes, record why live verification is not applicable.
- After successful verification, the task owner applies evidence-backed missing or stale Feature Map proposals before reporting the result. Keep issue-specific selectors, fixtures, and conclusions in task artifacts.
- Name pull-request review tasks with `PR #<number>` in human title.
- Agent review verdicts are advisory and do not change task status. The harness owns task lifecycle; report the verified PR state there.
- Never edit, reset, stash, clean, update, or commit the compatibility checkout named by the current harness brief; compatibility review is read-only.
- Use the machine-local setup skill to resolve or provision an owned isolated test store, checking active-task collisions first. Shared verification validates its explicit details and the assigned checkout binding; it does not choose services, credentials or site naming.
- Select a browser supported by the verified task host and check it with the installed verification guide. Drive the exact task-owned site and keep browser authentication state task-local. Report unavailable runtimes and any fallback actually used.
- An assigned-site HTTP 500 can be a missing WooCommerce autoload target (`src/Api/Infrastructure/Schema/aliases.php`); restore that target before browser preflight. Verified evidence.
- Pooled review checkouts can retain ignored Composer autoload maps that reference files absent from the pinned head. Regenerate autoloads locally; never copy newer production source into the checkout. Evidence.
- Before treating a test-local filter as a hook leak, inspect inherited teardown. WooCommerce's test base restores the WordPress hook registry, so a leak requires post-teardown evidence. Evidence.
- Localized user-directed source/diff/hook/filter inspection stays with the retained task lead. Use a separate read-only helper for concrete broad history/repository evidence, external research, runtime reproduction, independence, or context isolation.
- For PR explanations, inspect exact diff and surrounding source. Separate evidence from inference; do not invent author intent.
- Before using a WordPress or Gutenberg API, verify its source annotations and public documentation. Do not consume private, experimental, internal-only, or extender-unsupported symbols because Core uses them; stop for a design choice when no public API exists.
- Cross-version WordPress/Gutenberg behavior, compatibility shims, unstable or public APIs, serialization, and other public-contract work need an investigation package, independent design review, and user approval. Routine corrections need no ceremony.
- Review behavior-changing hook and filter changes through downstream persisted state, not only displayed output. Measure a claimed performance regression at real entrypoints with representative cache priming; otherwise call it a risk.
- Shared behavior lives in pstack; WooCommerce-specific lessons live in `roles/`. Use the installed `reflect` for evidence-backed learning proposals.

## Load by task

- Issue implementation and live behavior proof: `references/verification/README.md` in the `woocommerce-verification` skill and its scoped Feature Map (`references/verification/features/README.md` in the `woocommerce-verification` skill)
- PR drafting/publication/update or browser evidence: [pull-request-and-evidence.md](pull-request-and-evidence.md)
- Browser execution details only: `references/browser-evidence.md` in the `woocommerce-verification` skill and `references/browser-harness/README.md` in the `woocommerce-verification` skill
- Known facts only when changed surface intersects them: [compatibility-facts.md](compatibility-facts.md)

Do not read every linked file by default.
