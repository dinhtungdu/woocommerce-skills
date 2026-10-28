# Assigned WooCommerce environment

Use the assigned checkout. For an existing PR, verify its actual repository,
source branch and current head before driving the site.

Read the machine-local setup skill supplied by the harness (for example,
`woocommerce-test-store-setup`) to resolve or provision the task's environment.
If no matching local setup exists, use
the `create-test-environment-skill` skill
to create one outside the repository. The local companion owns launch,
dependencies, services, site mapping, credentials access,
fixtures, ownership and cleanup. This verification does not prescribe a host,
service stack, site layout or checkout-to-site naming scheme.

Before running verification, export explicit `WOO_CONTROL_SITE_URL` (the assigned
HTTP(S) wp-admin URL) and `WOO_CONTROL_SITE_DIR` (absolute WordPress root).
An existing local resolver may instead be supplied as
`WOO_CONTROL_SITE_URL_SCRIPT`; it runs from the canonical package root and must
return a wp-admin URL. The site directory is always explicit, never inferred
from a URL or checkout name. Missing setup details are a blocker; do not borrow
another checkout's environment. `verify site-url` validates these details but
does not prove that a site exists.

Doctor independently checks the site's WooCommerce plugin symlink against the
exact assigned checkout, then its browser availability. This local filesystem
binding is required by the current driver; remote/container setups must expose
that binding locally or report the unsupported boundary rather than skip it.

Check ownership and active-task collisions before using or recreating a site.
Never adopt legacy or unowned sites, fabricate ownership markers, repoint another
task's plugin, or infer cleanup authority from a derived URL. Use only the local
setup's ownership-checked cleanup on task-owned disposable data; preserve source,
user data and accepted evidence. Failed partial setup without proven ownership
must be inspected, not automatically removed. Never tie teardown to automatic
worktree deletion. Missing services/access do not authorize shared server or
security changes.
