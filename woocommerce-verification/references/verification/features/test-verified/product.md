# Product

> Status: test-verified on CI-gated trunk revision `4b6278b7a906da3b102c39b8a70a04ef5233d056`. The cited tests verify the behavior they assert.

## Sub-features

- Add variable product
- Add variations
- Browse product tags and attributes from the product page
- Grouped Product Page
- Import Products from a CSV file
- Merchant manages reviews
- Product > Export Selected Products
- Product Reviews
- Product customs fields
- Products > Product Images
- Products > Related products
- Products > Search and View a product
- Shopper > Update variable product
- Shopper adds reviews
- Update variations
- Variable Product Page
- WooCommerce Products > Downloadable Product Settings
- Shopper can change attributes to combination with dimensions and weight
- Shopper can change variable attributes to the same value
- Shopper can change variable product attributes to variation with a different price
- Shopper can reset variations
- add cross-sells
- add up-sells
- can add custom product attributes
- can approve, spam and trash a product review
- can bulk edit products
- can bulk edit variations
- can create a simple ${ productType } product
- can create a variable product
- can create attribute terms from the attributes modal

## How to get to it (user POV)

- Candidate route: `${ reviewsUrl }&comment_status=approved`
- Candidate route: `${ reviewsUrl }&comment_status=moderated`
- Candidate route: `${ reviewsUrl }&comment_status=spam`
- Candidate route: `${ reviewsUrl }&comment_status=trash`
- Candidate route: `cart/`
- Candidate route: `product/${ groupedProductSlug }`
- Candidate route: `product/${ product.slug }`
- Candidate route: `product/${ product1Slug }`
- Candidate route: `product/${ slug }`
- Candidate route: `shop/?s=${ productSearch }`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products&section=advanced`
- Candidate route: `wp-admin/admin.php?page=wc-settings&tab=products&section=downloadable`
- Candidate route: `wp-admin/comment.php?action=editcomment&c=${ review.id }`
- Candidate route: `wp-admin/edit.php?post_status=trash&post_type=product`
- Candidate route: `wp-admin/edit.php?post_type=product`
- Candidate route: `wp-admin/edit.php?post_type=product&page=product-reviews`
- Candidate route: `wp-admin/edit.php?post_type=product&page=product_importer`
- Candidate route: `wp-admin/edit.php?post_type=product&s=${ product.name }`
- Candidate route: `wp-admin/edit.php?post_type=product&stock_status=instock&s=${ productSearch }`
- Candidate route: `wp-admin/edit.php?post_type=product&stock_status=outofstock&s=${ productSearch }`

## Driving it with Playwright

Source specs:

- `plugins/woocommerce/tests/e2e/tests/product/create-product-attributes.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/create-variable-product.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/create-variations.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-create-simple.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-customs.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-delete.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-edit.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-export.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-grouped-stock-status.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-grouped.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-images.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-import-csv.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-linked-products.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-reviews.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-search.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-settings.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-tags-attributes.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/product-variable.spec.ts`
- `plugins/woocommerce/tests/e2e/tests/product/update-variations.spec.ts`

Candidate test steps:

- Clear the featured image
- Clear the remaining gallery image
- Clear the selected products
- Confirm the bulk request waits for the variation save.
- Confirm the first variation page is selected.
- Confirm the page, the edit and its dirty state are preserved.
- Create a variable product with that global attribute
- Create the ordered product gallery
- Create variable product for bulk edit after save test
- Create variable product for bulk edit test
- Create variable product for failed save before bulk edit test
- Create variable product for individual edit test
- Create variable product for pagination cancel test
- Dismiss the save warning raised by paginating.
- Edit a variation without saving.
- Edit the first variation.
- Edit the second variation.
- Edit the third variation.
- Expand all variations
- Expand all variations.
- Expand the first variation and edit it without saving.
- Expect its details to be saved correctly
- Expect that there are no more variations.
- Expect the default attributes to be pre-selected
- Expect the first variation to be virtual.
- Expect the number of variations to be ${ expectedGeneratedVariations.length }
- Expect the second variation to be virtual.
- Expect the stock quantity to be saved correctly
- Expect the variation to be removed
- Expect the weight and dimensions of the third variation to be correct.

The cited tests prove their asserted behavior on the verified revision. Run the assigned-site user path only when the task depends on visual or manual behavior, mocks, environment-specific behavior, or a claim outside those assertions.

## Gotchas

- Playwright setup may create fixtures through REST APIs, use mocks, or depend on the repository E2E environment; distinguish fixture setup from the behavior actually asserted.
- Dynamic routes and generated fixture values require resolution before manual use.
- Keep issue-specific selectors and conclusions in task artifacts.
