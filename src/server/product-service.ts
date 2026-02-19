import request from "graphql-request";
import { graphql, readFragment, type ResultOf } from "gql.tada";
import { vendureApi } from "../config";

const ProductDetailFragment = graphql(`
  fragment ProductDetail on Product {
    id
    name
    slug
    description
    featuredAsset {
      id
      preview
    }
    assets {
      id
      preview
    }
    optionGroups {
      id
      code
      name
      options {
        id
        code
        name
      }
    }
    variants {
      id
      name
      sku
      stockLevel
      currencyCode
      priceWithTax
      options {
        id
        code
        name
        group {
          id
          name
        }
      }
      featuredAsset {
        id
        preview
      }
      assets {
        id
        preview
      }
    }
  }
`);

const PopularProductsQuery = graphql(
  `
    query GetPopularProducts($limit: Int!) {
      products(options: { take: $limit }) {
        items {
          ...ProductDetail
        }
      }
    }
  `,
  [ProductDetailFragment]
);

export type ProductDetail = NonNullable<ResultOf<typeof ProductDetailFragment>>;

/**
 * Gets the first 5 products from Vendure
 */
export async function getPopularProducts(
  locale: string
): Promise<ProductDetail[]> {
  const result = await request(vendureApi(locale), PopularProductsQuery, { limit: 4 });
  return result.products.items.map(item => readFragment(ProductDetailFragment, item)) ?? [];
}
