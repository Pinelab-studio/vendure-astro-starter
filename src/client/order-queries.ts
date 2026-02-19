import { graphql, type ResultOf } from "gql.tada";

export const ActiveOrderFragment = graphql(`
    fragment ActiveOrder on Order {
      __typename
      id
      code
      state
      currencyCode
      totalQuantity
      subTotalWithTax
      shippingWithTax
      totalWithTax
      lines {
        id
        unitPriceWithTax
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
        }
        featuredAsset {
          id
          preview
        }
      }
      shippingLines {
        id
        priceWithTax
        shippingMethod {
          id
          name
        }
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        postalCode
        country
      }
      billingAddress {
        fullName
        streetLine1
        streetLine2
        city
        postalCode
        country
      }
    }
  `);

export const ActiveOrderQuery = graphql(
    `
      query GetActiveOrder {
        activeOrder {
          ...ActiveOrder
        }
      }
    `,
    [ActiveOrderFragment]
);

export const AddItemToOrderMutation = graphql(`
      mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
          ...ActiveOrder
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `,
    [ActiveOrderFragment]
);