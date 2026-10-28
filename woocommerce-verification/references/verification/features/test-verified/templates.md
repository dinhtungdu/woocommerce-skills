# Templates

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- ${ templateName } template
- ${ testData.templateName } template
- Legacy templates
- Product Search Results template
- Shop page
- Single Product Template
- Single Product template
- Template customization
- Template part customization
- Template priority
- Test the cart template
- Test the checkout template
- Test the order confirmation template
- Template can be accessed from the page editor
- Template can be opened in the site editor
- can be modified and reverted
- loads the Single Product template for a specific product
- loads the correct template in the Site Editor
- loads the product catalog template after the shop page permalink is updated via REST API
- loads the theme template for a specific product using the product slug and it can be customized
- priorities are applied correctly in the ${ testData.templateName } template
- template selector is not visible in the Page editor
- theme template has priority over user-modified ${ fallbackTemplate.templateName } template
- user-modified ${ templateName } template based on the theme template has priority over the user-modified template based on the default WooCommerce template
- woocommerce//* slug is supported

## How to get to it (user POV)

- Candidate route: `/mini-cart`
- Candidate route: `market/`
- Candidate route: `shop/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/templates/cart-template.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/checkout-template.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/legacy-templates.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/order-confirmation.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/product-search-results.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/shop-page.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/single-product-template.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/single-product-template.block_theme_with_templates.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/template-customization.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/template-customization.block_theme_with_templates.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/template-part-customization.classic_theme_with_template_parts.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/template-part-customization.classic_theme_with_template_parts_support.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/templates/template-priority.block_theme.spec.ts`

Candidate test steps:

- Customize existing template to create DB entry
- Update created term to legacy format in the DB
- Verify the template can be edited via a legacy ID
- Verify the template is listed in the Site Editor UI
- Verify the template loads correctly in the frontend
- WooCommerce template
- custom fallback template with WooCommerce slug
- custom fallback template with theme slug
- custom template with WooCommerce slug
- custom template with theme slug
- theme template

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
