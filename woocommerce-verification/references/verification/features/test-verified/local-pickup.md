# Local Pickup

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Merchant → Local Pickup Settings
- Merchant can configure Local Pickup general settings
- Merchant can manage a Local Pickup location lifecycle

## How to get to it (user POV)

- Derive the user entry point from the source specs during live verification.

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/local-pickup/local-pickup.merchant.block_theme.spec.ts`

Candidate test steps:

- Add, save, and reload a pickup location
- Configure and save the general settings
- Delete, save, and reload the pickup location
- Edit, save, and reload the pickup location
- Reload and confirm the settings persisted

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
