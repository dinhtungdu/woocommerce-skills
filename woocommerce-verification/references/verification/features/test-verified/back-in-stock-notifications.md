# Back In Stock Notifications

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Anonymous visitor
- Back in Stock Notifications — My Account
- Back in Stock Notifications — admin management
- Back in Stock Notifications — feature disabled
- Back in Stock Notifications — receiving back-in-stock emails
- Back in Stock Notifications — receiving confirmations
- Back in Stock Notifications — signing up
- Back in Stock Notifications — variable products and variations
- Double opt-in
- Double opt-in — signups land PENDING
- Guest — double opt-in
- Guest — requires account
- Guest — single opt-in
- Logged-in customer with no signups
- Logged-in customer with signups
- Logged-in customer, single opt-in
- Signups disabled
- Single opt-in
- Single opt-in — signups land ACTIVE
- admin settings
- Resend verification email on a pending notification dispatches a new verify email
- Resend verification is not offered for notifications that are already active
- a missing nonce is rejected once nonce checks are on
- a parent opted out of signups renders no form on its product page
- a product id that does not exist is rejected
- a verify link with a tampered key leaves the signup pending
- admin Cancel action marks an active notification as Cancelled
- an expired verify link is rejected
- an invalid email address is rejected
- an unsubscribe link with a tampered key changes nothing

## How to get to it (user POV)

- Candidate route: `my-account/`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/feature-disabled.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/managing-notifications.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/my-account.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/receiving-confirmations.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/receiving-notifications.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/signing-up.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/back-in-stock-notifications/variations.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
