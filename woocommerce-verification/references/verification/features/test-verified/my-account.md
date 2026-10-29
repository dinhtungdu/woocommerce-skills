# My Account

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Customer can manage addresses in My Account > Addresses page
- Customer can manage downloadable file in My Account > Downloads page
- Customer can pay for their order through My Account
- My account page
- Shopper My Account Create Account
- allows customer to login and navigate
- allows customer to pay for their order in My Account
- can add billing address from my account
- can create a new account via my account
- can see downloadable file and click to download it
- shows the temporary password reminder on My Account after registration

## How to get to it (user POV)

- Candidate route: `my-account/`
- Candidate route: `my-account/downloads/`
- Candidate route: `my-account/edit-account/`
- Candidate route: `my-account/edit-address/`
- Candidate route: `my-account/edit-address/billing`
- Candidate route: `my-account/orders/`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/my-account/my-account-addresses.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/my-account/my-account-create-account.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/my-account/my-account-downloads.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/my-account/my-account-pay-order.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/my-account/my-account.spec.ts`

Candidate test steps:

- customer can navigate to ${ accountPage } page

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
