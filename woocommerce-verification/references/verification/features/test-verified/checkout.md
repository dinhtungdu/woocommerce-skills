# Checkout

> Status: test-verified on CI-gated trunk revision `aa5308378124f891ed07d230085787ff11e11e97`. The cited tests verify the behavior they assert.

## Sub-features

- Billing Address Form
- Checkout Block → Locale hides address fields but not country
- Checkout Link Endpoint
- Custom Place Order Button
- Guest shopper
- Guest user
- Logged in shopper
- Logged-in user
- Merchant → Additional Checkout Fields
- Merchant → Checkout
- Shopper (guest) → Order Confirmation → Create Account
- Shopper (logged-in) → Order Confirmation
- Shopper → Additional Checkout Fields
- Shopper → Checkout Form Errors (guest user)
- Shopper → Extensibility
- Shopper → Local pickup
- Shopper → Order Confirmation → Downloadable Products
- Shopper → Shipping (customer user)
- Shopper → Store shipping disabled
- Shortcode Checkout Custom Place Order Button
- extensionCartUpdate
- Can complete checkout with locale-hidden address fields
- Cart data can be modified by extensions
- Completed downloadable order exposes named entitlement links
- Conditional field stays hidden while the field it depends on has no value
- Conditional fields are shown/hidden based on cart state
- Country remains visible even when locale tries to hide it
- Delayed account creation flows
- Ensure billing is empty and shipping address is filled
- Fields with JSON schema validation show appropriate error messages

## How to get to it (user POV)

- Candidate route: `/my-account`
- Candidate route: `my-account/`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ orderId }`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/additional-fields.guest-shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/additional-fields.merchant.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/additional-fields.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/checkout-block-custom-place-order-button.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/checkout-block-extensibility.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/checkout-block-locale-hide-country.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/checkout-block.merchant.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/checkout-block.shopper.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/blocks/checkout/order-confirmation.block_theme.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/checkout/checkout-link.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/checkout/checkout-shortcode-custom-place-order-button.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/checkout/checkout.spec.ts`

Candidate test steps:

- Merchant can edit custom fields from the order admin page
- Merchant can see additional fields in the order admin page

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
