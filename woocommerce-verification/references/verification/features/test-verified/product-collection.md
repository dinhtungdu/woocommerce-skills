# Product Collection

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ collection.name }
- ${ templateTitle } template
- Collection switching
- Hand-Picked Products
- Have hidden implementation in UI
- My Custom Collection
- My Custom Collection with Advanced Preview
- My Custom Collection with Preview
- Product Collection
- Product Collection should be visible after Refresh
- Product Collection: Collection Pickers
- Product Collection: Collections
- Product Collection: Compatibility Layer
- Product Collection: Extensibility Events
- Product Collection: Inspector Controls
- Product Collection: Product Picker
- Product Collection: Register Product Collection
- Product Page: error notices
- Related Products collection
- Responsive
- With other blocks
- default query can be modified
- wc-blocks_viewed_product is emitted
- Best Sellers
- Best Sellers collection can be added and displays proper products
- Block with shrink columns DISABLED collapses to single column on small screens
- Block with shrink columns ENABLED correctly displays as grid
- Can be migrated to from Products (Deprecated) block
- Can select ${ collection.termName } and Done button becomes enabled
- Can select multiple products and Done button becomes enabled

## How to get to it (user POV)

- Candidate route: `/?p=${ postId }`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/collection-pickers.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/collections.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/compatibility-layer.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/extensibility-events.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/inspector-controls.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/product-collection-errors.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/product-collection.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/product-picker.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/product-collection/register-product-collection.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
