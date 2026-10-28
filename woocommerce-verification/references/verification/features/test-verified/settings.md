# Settings

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Colour picker swatch height on Email settings
- Manage webhooks
- Product permalink settings
- Settings UI feature flag
- WooCommerce General Settings
- WooCommerce Tax Settings > enable
- WooCommerce.com Settings screen
- Save Changes button is disabled by default and enabled only after changes.
- Webhook cannot be bulk deleted without nonce
- admin can manage consumer keys
- can add tax classes
- can enable tax calculation
- can remove tax classes
- can set rate settings
- can set tax options
- colour swatch is correctly sized with WP 7.0 body class
- fails closed when an executed script omits its component registration
- loads a declared component registration before mounting settings
- loads the private DataForm runtime without compatibility failures
- renders both opt-in controls with their accessible labels
- saved product permalink structures stay selected after a reload
- saves a DataForm edit through the form post round-trip
- submits an untouched inventory value through classic sanitization
- toggles dependent fields with a visibility rule

## How to get to it (user POV)

- Candidate route: `${ WEBHOOKS_SCREEN_URI }&action=delete&webhook[]=${ webhookID }`
- Candidate route: `./wp-admin/admin.php?page=wc-settings&tab=advanced&section=keys`
- Candidate route: `wp-admin/admin.php?page=wc-settings`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=advanced&section=woocommerce_com`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=email`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=general`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products&section=inventory`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products&section=settings_ui_component_registered`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=tax`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=tax&section=fancy`
- Candidate route: `wp-admin/options-permalink.php`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/settings/colour-picker-swatch-height.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/consumer-token.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/product-permalinks.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/settings-general.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/settings-tax.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/settings-ui-feature-flag.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/settings-woo-com-screen.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/settings/webhooks.spec.ts`

Candidate test steps:

- can generate a consumer key
- can revoke the consumer key
- can use the consumer key
- navigate to rest api settings page

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
