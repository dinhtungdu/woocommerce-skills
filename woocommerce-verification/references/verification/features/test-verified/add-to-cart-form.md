# Add To Cart Form

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name } Block
- Stepper Layout
- can be added in the Post Editor - Single Product Template
- can be added in the Post Editor only as inner block of the Single Product Block
- can be added in the Site Editor only as inner block of the Single Product Block - Product Catalog Template
- can be migrated to the blockified Add to Cart + Options block
- has the stepper mode working on the frontend
- has the stepper option visible

## How to get to it (user POV)

- Derive the user entry point from the source specs during live verification.

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/add-to-cart-form/add-to-cart-form.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
