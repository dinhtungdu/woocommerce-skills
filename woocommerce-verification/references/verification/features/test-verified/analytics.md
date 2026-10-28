# Analytics

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Analytics Settings - Scheduled Import
- Analytics pages
- manual import trigger
- moving sections
- a user should see 3 sections by default - Performance, Charts, and Leaderboards
- analytics settings
- downloads revenue report as CSV
- hides the manual update trigger in immediate mode
- renders the overview performance indicators
- scope orders report via advanced product filter
- set custom date range on revenue report
- should allow a user to add a section back in
- should allow a user to move a section down
- should allow a user to move a section up
- should allow a user to remove a section
- should not display move up for the top, or move down for the bottom section
- should show Immediate mode by default when option is not set
- should switch from immediate to scheduled mode without confirmation modal
- should switch from scheduled to immediate mode with confirmation modal - cancel flow
- should switch from scheduled to immediate mode with confirmation modal - confirm flow
- shows the manual update trigger in scheduled mode
- use date filter on products report
- use filter by single product on products report

## How to get to it (user POV)

- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Forders&filter=advanced&product_includes=${ productIds[ 0 ] }`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Foverview`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fproducts&filter=single_product&products=${ variableProductId }`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fproducts&filter=single_product&products=${ variableProductId }&is-variable=1`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Frevenue`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Fsettings`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/analytics/analytics-overview.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/analytics/analytics-settings.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/analytics/analytics.spec.ts`

Candidate test steps:

- Add the Performance section back in.
- Assert response status is OK
- Check the bottom section
- Check the top section
- Expect second section becomes first section, first becomes second
- Expect the Performance section to be added back.
- Expect the Performance section to be hidden
- Expect the second section to become first, and first becomes second.
- Go to Analytics > Overview
- Go to Analytics > Settings
- Initialize locators
- Inspect the response payload to verify that Performance section was successfully hidden
- Move first section down
- Move second section up
- Remove the Performance section
- Send GET request to get the current user id
- Send POST request to hide Performance section
- Send POST request to reset all sections
- Verify that sections were reset

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
