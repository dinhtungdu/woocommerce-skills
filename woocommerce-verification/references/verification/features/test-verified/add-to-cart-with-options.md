# Add To Cart With Options

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Add to Cart + Options Block
- Add to Cart + Options Block (block theme with templates)
- autoselect behavior
- ${ optionStyle }: Combining autoselect and disabledAttributesAction block attributes should work
- ${ optionStyle }: Test the autoselect block attribute
- ${ optionStyle }: Test the disabledAttributesAction block attribute
- allows adding 3rd-party product types to cart when using PHP templates
- allows adding grouped products to cart
- allows adding grouped products to cart when inside the Product block
- allows adding simple products to cart
- allows adding simple products to cart when inside the Product block
- allows adding variable products to cart
- allows adding variable products to cart when inside the Product block
- allows adding variable products with custom attribute slugs
- allows adding variations to cart when inside the Product block
- allows modifying the template parts
- allows updating the Product Image Gallery block to the Product Gallery block
- correctly reconciles cart state when adding grouped products multiple times
- handles rapid add-to-cart clicks correctly
- respects quantity constraints

## How to get to it (user POV)

- Candidate route: `/?p=${ customProductId }`
- Candidate route: `/beanie`
- Candidate route: `/product/custom-slug-variable/`
- Candidate route: `/product/hoodie/`
- Candidate route: `/product/logo-collection`
- Candidate route: `/product/logo-collection/`
- Candidate route: `/product/t-shirt`
- Candidate route: `/product/t-shirt/`
- Candidate route: `/product/v-neck-t-shirt/`
- Candidate route: `/product/wordpress-pennant/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/add-to-cart-with-options/add-to-cart-with-options.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/add-to-cart-with-options/add-to-cart-with-options.block_theme_with_templates.spec.ts`

Candidate test steps:

- ${ optionStyle }: Expect NOTHING to be auto-selected (on page load)
- ${ optionStyle }: Expect attributes to NOT auto-select when user selects something
- ${ optionStyle }: Expect attributes to auto-select when user selects something
- ${ optionStyle }: Expect invalid options to be disabled (by prop) and hidden
- ${ optionStyle }: Expect invalid options to be disabled (by prop) and visible
- ${ optionStyle }: Expect only the Type attribute to be auto-selected (on page load)
- ${ optionStyle }: Set the autoselect setting to true
- Add the Blue/XL variation to cart
- add the same products again without reloading — should update quantities via batcher
- add two child products to cart
- allows interacting with the form in the frontend
- allows switching to 3rd-party product types in the editor
- child simple product quantities can be decreased down to 0
- disabledAttributesAction === ${ disabledAttributesAction }: Expect options to be properly auto-selected
- displays an error when attempting to add grouped products with zero quantity
- displays an error when attributes are not selected
- hides Product Quantity input when the product is sold individually
- if one product succeeds and another fails, optimistic updates are applied and an error is displayed
- in grouped products
- in simple products
- in variable products
- increase and reduce quantity buttons work even when no variation is selected
- make sure quantities below min are not allowed even when manually filled but they persist in the input field
- products sold individually can be added to cart
- renders inner blocks for external products
- renders inner blocks for grouped products
- renders inner blocks for simple products
- renders inner blocks for variable products
- resets blocks rendering variation data when attributes are deselected
- successfully adds to cart when attributes are selected

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
