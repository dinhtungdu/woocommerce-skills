# Onboarding

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Add Product Task
- Block Theme (Twenty Twenty Four)
- Classic Theme (Storefront)
- Launch Your Store - logged in
- Launch Your Store front end - logged out
- NOX onboarding critical flows
- Store owner can complete the core profiler
- Store owner can skip the core profiler
- Can complete the core profiler skipping extension install
- Can complete the core profiler with an extension selected
- Can connect to WooCommerce.com
- Can hide the task list
- Can skip the guided setup
- Entire site coming soon mode frontend
- Entire site coming soon mode${ testSuffix }
- Homescreen badge coming soon entire store
- Homescreen badge coming soon store only
- Homescreen badge live
- Payments task list item links to Payments settings page
- Products page redirects to add product task when no products exist
- Site visibility settings
- Store only coming soon mode frontend
- Store only coming soon mode${ testSuffix }
- can start in-context onboarding from Payments settings

## How to get to it (user POV)

- Candidate route: `./`
- Candidate route: `shop/`
- Candidate route: `wp-admin/admin.php?page=wc-admin`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard`
- Candidate route: `wp-admin/admin.php?page=wc-admin&tab=my-subscriptions&path=%2Fextensions`
- Candidate route: `wp-admin/admin.php?page=wc-admin&task=products`
- Candidate route: `wp-admin/admin.php?page=wc-settings`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=checkout&from=wc_settings_payments`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=site-visibility`
- Candidate route: `wp-admin/edit.php?post_type=product`
- Candidate route: `wp-admin/plugins.php?plugin_status=active`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/onboarding/add-product-task.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/onboarding/launch-your-store.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/onboarding/nox-onboarding.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/onboarding/onboarding-wizard.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/onboarding/setup-checklist.spec.ts`

Candidate test steps:

- Business Information
- Check we hand off to WooCommerce.com with a valid OAuth request
- Confirm that core profiler was completed and no extensions installed
- Confirm that information from core profiler saved
- Confirm that the store is in coming soon mode after skipping the core profiler
- Confirm the selection was installed and the profiler finished
- Extensions -- do not install any
- Go to WC Home and make sure the total sales is visible
- Go to the extensions tab and connect store
- Hide the task list
- Intro page and opt in to data sharing
- Load the WC Admin page.
- Select one extension and continue
- User profile information
- Walk the profiler to the extensions step

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
