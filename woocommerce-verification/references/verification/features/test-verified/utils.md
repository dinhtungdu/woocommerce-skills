# Utils

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- registerProductBlockType registers
- blocks are registered correctly when switching templates via command palette
- blocks which are registered via the registerProductBlockType function are visible in the templates data views

## How to get to it (user POV)

- Derive the user entry point from the source specs during live verification.

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/utils/register-block-single-product-template.block_theme.spec.ts`

Candidate test steps:

- Blocks available after switching to Single Product template
- Blocks not available in non-product template
- Switch to Single Product template via command palette

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
