# Downloads and download permissions

## Sub-features

- Front-end download handler for links sent in order emails and listed in My Account → Downloads.
- Download permissions granted when an order with downloadable items is completed.
- Guest links (`email=` or `uid=`) and registered-customer links built for My Account → Downloads.
- Download counts stored per permission.

## How to get to it (user POV)

- A customer completes an order containing a downloadable product, then opens the link from the order email, the order-received page, or My Account → Downloads.
- Merchants see the grants on the order edit screen under **Downloadable product permissions** and the files under the product's **Downloadable** data fields.
- The handler route is `/?download_file=<product_id>&order=<order_key>&email=<billing_email>&key=<download_id>`. Guest links may use `uid=<sha256 of the billing email>` instead of `email=`.

## Driving it with HTTP and WP-CLI

- Create fixtures with `wp eval-file`: a simple virtual downloadable product with `set_downloads()`, then an order created with `wc_create_order()`, a billing email, one line item, and status `completed`. Completing the order grants the permissions.
- Give each download file a unique marker string so the response body shows which file was served.
- Build links with `$item->get_item_download_url( $download_id )`. For a customer, `wc_get_customer_available_downloads( $user_id )` returns the same links My Account → Downloads lists.
- Read grants from the `customer-download` data store or `wp_woocommerce_downloadable_product_permissions`.
- Request each link with `curl` and no cookies for guest behavior. Assert the HTTP status and grep the body for the file marker or `Invalid download link.`.
- Include controls: a valid guest `email=` link, a valid `uid=` link, and a registered customer's link must each return 200 with the expected file. A key that matches no granted download must return 403.
- Read `download_count` after the run when the change affects which requests count as downloads.

## Gotchas

- Record the download settings first (`woocommerce_file_download_method`, `woocommerce_downloads_require_login`, `woocommerce_downloads_grant_access_after_payment`). Results differ for `force`, redirect, and X-Sendfile, and for login-required stores.
- Files must live in an approved download directory. Without one, or with a malformed download ID, every request returns 403 and proves nothing. Use `wp_generate_uuid4()` for generated IDs.
- Successful requests increment `download_count`, so reruns change stored data. Record counts before and after.
- `wp eval-file` may print a sendmail error because order emails cannot be sent; it does not affect the fixture.
- Curl alone does not cover the browser flows. Verify My Account → Downloads, the order edit permissions panel, the REST customer downloads endpoint, expiry, and download limits separately when the task depends on them.
- Live evidence for this entry: assigned-site base-versus-head runs with the `force` method, October 2026.
