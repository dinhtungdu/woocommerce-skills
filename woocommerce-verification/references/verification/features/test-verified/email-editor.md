# Email Editor

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Update propagation — core flows
- Update propagation — editor rewrites
- WooCommerce Email Editor Core
- WooCommerce Email Editor Delete
- WooCommerce Email Editor Reset Template
- WooCommerce Email Editor Settings Sidebar Integration
- @pr Blocks the editor rewrote on save still auto-resolve
- @pr Review drawer: pick per-conflict yours vs core and apply
- Can access the email editor
- Can edit and save content
- Can preview in new tab
- Can reset a customized email template to default
- Can send test email
- Can update email recipients
- Can update email status
- Can update email subject and preview text
- Can use personalization tags in the Button block
- Deleting an email from the editor opens the email listing
- Does not show the core Content block list in the Email tab
- Saving a shipped template in the editor without editing it leaves every block untouched
- Shows the Content list in the Block tab of a content-only block

## How to get to it (user POV)

- Candidate route: `/wp-admin/admin.php?page=wc-settings&tab=email`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/email-editor/email-editor-delete.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email-editor/email-editor-loads.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email-editor/email-editor-reset-template.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email-editor/email-editor-settings-sidebar.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email-editor/update-propagation/core-flows.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/email-editor/update-propagation/editor-rewrites.spec.ts`

Candidate test steps:

- Use the source test titles and accessible selectors as the initial drive recipe.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
