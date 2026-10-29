# Email

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- WooCommerce Email Editor Tracking Selectors
- WooCommerce Email Settings
- WooCommerce Email Settings List View
- ${ role } receives email for ${ status } order
- Check selectors for tracking events
- Choose image in email image url field
- Customer should receive an email when initiating a password reset
- Customer should receive an email when password reset initiated from admin
- Email listing assets load only where the listing renders
- Email preview renders, switches type, and updates live when settings change
- Email settings list view renders correctly and allows to edit email status and search
- Merchant can resend order details to customer
- New customer should receive an email with login details
- Preview action renders the file template for emails without a saved post
- Send email preview
- Zero cost shipping method keeps its title in the order email
- saved email is sent from the customized post

## How to get to it (user POV)

- Candidate route: `my-account/lost-password/`
- Candidate route: `wp-admin/admin.php?page=wc-orders&action=edit&id=${ order.id }`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=email`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=general`
- Candidate route: `wp-admin/users.php`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/email/account-emails.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email/editor-tracking-selectors.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email/order-emails-block-editor.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email/order-emails.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email/settings-email-listing.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email/settings-email.spec.ts`

Candidate test steps:

- admin sends password reset link
- check the email content
- check the email exists
- initiate password reset from my account

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
