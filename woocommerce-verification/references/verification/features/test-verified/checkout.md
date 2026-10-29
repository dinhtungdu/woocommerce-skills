# Checkout

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Attributes
- Billing Address Form
- Can adjust T&S and Privacy Policy options
- Checkout Block → Locale hides address fields but not country
- Checkout Link Endpoint
- Checkout actions
- Custom Place Order Button
- Guest shopper
- Guest user
- Logged in shopper
- Merchant → Additional Checkout Fields
- Merchant → Checkout
- Shipping and billing addresses
- Shopper (guest) → Order Confirmation
- Shopper (guest) → Order Confirmation → Create Account
- Shopper (logged-in) → Order Confirmation
- Shopper → Account (guest user)
- Shopper → Additional Checkout Fields
- Shopper → Checkout Form Errors (guest user)
- Shopper → Extensibility
- Shopper → Local pickup
- Shopper → Order Confirmation → Downloadable Products
- Shopper → Order Confirmation → Local Pickup
- Shopper → Place Guest Order
- Shopper → Place Virtual Order
- Shopper → Shipping (customer user)
- Shopper → Shipping and Billing Addresses
- Shortcode Checkout Custom Place Order Button
- extensionCartUpdate
- Apartment input visibility and optional and required can be toggled

## How to get to it (user POV)

- Candidate route: `/checkout/order-received`
- Candidate route: `/my-account`
- Candidate route: `my-account/`
- Candidate route: `wp-admin/post.php?post=${ orderId }&action=edit`

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
- `plugins/woocommerce/tests/e2e/tests/checkout/checkout-shortcode-state-field.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/checkout/checkout.spec.ts`

Candidate test steps:

- Logout the user and revisit the order received page to verify that details are displayed when woocommerce_order_received_verify_known_shoppers is disabled

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
