# Attributes Filter

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- ${ blockData.name } Block
- ${ blockData.name } Block - with PHP classic template
- ${ blockData.name } Block - with Product Collection
- edits the title, display style, and Apply behavior
- filters Product Collection automatically and defers changes until Apply when configured
- filters the PHP classic template by attribute

## How to get to it (user POV)

- Candidate route: `/shop`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/attributes-filter/attribute-filter.block_theme.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
