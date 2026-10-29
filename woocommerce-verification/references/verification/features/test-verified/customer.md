# Customer

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Merchant > Customer List
- Merchant can use advanced filters
- Merchant can view a list of all customers, filter and download
- Merchant can view a single customer

## How to get to it (user POV)

- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fcustomers`
- Candidate route: `wp-admin/admin.php?page=wc-admin&path=%2Fcustomers&per_page=100`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/customer/customer-list.spec.ts`

Candidate test steps:

- Add a filter for country
- Add a filter for email
- Apply the filters
- Check that 3 customers are displayed
- Check that the customer is displayed
- Check that the customer list can be filtered by first name
- Check that the customers are displayed in the list
- Check that the filter is applied
- Download the customer list
- Go to the customers reports page
- Hide and display columns
- Switch to advanced filters
- Switch to single customer view

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
