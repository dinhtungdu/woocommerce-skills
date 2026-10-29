# Price Filter

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name } Block - editor side
- ${ blockData.name } Block - with All products Block
- ${ blockData.name } Block - with PHP classic template
- ${ blockData.name } Block - with Product Collection
- edits the title, display style, and Apply behavior
- filters Product Collection automatically and defers changes until Apply when configured
- filters the All Products block by maximum price
- filters the classic product template by maximum price
- restores decimal URL prices without rejecting the Store API request

## How to get to it (user POV)

- Candidate route: `/?p=${ postId }`
- Candidate route: `/shop`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/price-filter/price-filter.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
