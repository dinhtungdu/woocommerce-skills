# Analytics

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Analytics Settings - Scheduled Import
- Analytics pages
- analytics settings
- downloads revenue report as CSV
- loads the overview performance indicators from their own endpoint
- manages scheduled import mode confirmation and persistence
- persists reordered Analytics sections after reload
- scope orders report via advanced product filter
- set custom date range on revenue report
- shows the import status bar and runs its manual trigger in scheduled mode
- use date filter on products report
- use filter by single product on products report

## How to get to it (user POV)

- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Forders&filter=advanced&product_includes=${ productIds[ 0 ] }`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Foverview`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fproducts&filter=single_product&products=${ variableProductId }`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fproducts&filter=single_product&products=${ variableProductId }&is-variable=1`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Frevenue`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fsettings`
- Candidate route: `wp-login.php`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/analytics/analytics-overview-tour.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/analytics/analytics-overview.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/analytics/analytics-settings.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/analytics/analytics.spec.ts`

Candidate test steps:

- Assert response status is OK
- Assert the default sections and their real controls
- Cancel a scheduled to immediate change
- Confirm and persist immediate mode
- Create an administrator for this spec
- Go to Analytics > Overview
- Go to Analytics > Settings
- Initialize locators
- Log in as that administrator
- Mark the metrics tour as seen
- Move Performance below Charts and save
- Return to scheduled mode without a warning
- Send POST request to reset all sections
- Use Immediate when the option is absent
- Verify that sections were reset

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
