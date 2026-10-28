# Paypal

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- PayPal Standard enablement and Jetpack onboarding
- PayPal Standard can be enabled
- PayPal Standard onboards to Jetpack upon changing any setting

## How to get to it (user POV)

- Candidate route: `/wp-admin/index.php`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/paypal/paypal.spec.ts`

Candidate test steps:

- Check the setting present only when Jetpack onboarding is complete
- Enable PayPal Standard
- Revert title change
- Update the title field

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
