# Single Product Template

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.slug } Block
- Compatibility Layer in Single Product template
- Product Rating block is not visible if ratings are disabled for product
- Product Rating block is not visible if ratings are disabled globally in the store
- hooks are attached to the page
- hooks are attached to the page when using the Add to Cart + Options block
- shows password form in products protected with password

## How to get to it (user POV)

- Candidate route: `/product/${ blockData.productSlug }/`
- Candidate route: `/product/hoodie/`
- Candidate route: `/product/sunglasses/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/single-product-template/single-product-template-compatibility-layer.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/single-product-template/single-product-template.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/single-product-template/single-product-template.product-rating.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
