# woo-control

The existing CLI retains its Chrome/CDP and Playwright assertion/evidence logic.
Run the native entry point from the task checkout:

```sh
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" list
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" doctor --browser playwright
python3 "$WOO_VERIFICATION_DIR/references/verification/verify" run shop --evidence tmp/verification/shop --browser playwright
```

The CLI resolves Playwright from the target checkout first, then its own bundled
resource directory. Install the task's existing browser dependencies when needed.
If the task does not provide Playwright, the optional bundled package can be
prepared with `npm ci --prefix "$WOO_VERIFICATION_DIR/references/verification"`
and `npx --prefix "$WOO_VERIFICATION_DIR/references/verification" playwright install chromium`
when dependency/browser installation is authorized. These are separate setup
steps; `skills add` does not install runtime dependencies. Use Chrome/CDP only
when the verification guide allows it and access is available. No dependencies,
browsers, or global command links are installed by this port. The machine-local
setup supplies the wp-admin URL and absolute WordPress root through explicit
settings; doctor independently verifies the plugin targets the assigned checkout.
See [the environment contract](../worktree/README.md). Missing local setup can be
created with the `create-test-environment-skill` skill.

Safe mocked check: `node tests/test-woo-control.mjs`. This does not prove a live site.
