# Shipping

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- can delete the shipping zone method
- can delete the shipping zone region
- saves an unsaved shipping zone when adding a method

## How to get to it (user POV)

- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=shipping`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=shipping&section=classes`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=shipping&zone_id=new`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/shipping/shipping-classes.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/shipping/shipping-zones.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
