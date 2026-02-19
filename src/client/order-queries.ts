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
      couponCodes
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

export const AdjustOrderLineMutation = graphql(`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`, [ActiveOrderFragment]);

export const ApplyCouponCodeMutation = graphql(`
  mutation ApplyCouponCode($couponCode: String!) {
    applyCouponCode(couponCode: $couponCode) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`, [ActiveOrderFragment]);

export const RemoveCouponCodeMutation = graphql(`
  mutation RemoveCouponCode($couponCode: String!) {
    removeCouponCode(couponCode: $couponCode) {
      ...ActiveOrder
    }
  }
`, [ActiveOrderFragment]);