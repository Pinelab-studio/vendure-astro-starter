import request from "graphql-request";
import { graphql, readFragment, type ResultOf } from "gql.tada";
import { atom } from "nanostores";
import { vendureApi } from "../../config";

const ActiveOrderFragment = graphql(`
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
  }
`);

const ActiveOrderQuery = graphql(
  `
    query GetActiveOrder {
      activeOrder {
        ...ActiveOrder
      }
    }
  `,
  [ActiveOrderFragment]
);

export type ActiveOrder = NonNullable<
  ResultOf<typeof ActiveOrderFragment>
>;

/** Nanostore holding the active order so components can reactively read it */
export const $activeOrder = atom<ActiveOrder | null>(null);

/**
 * Fetch the active order from Vendure and persist it in the store.
 */
export async function fetchActiveOrder(locale: string): Promise<ActiveOrder | null> {
  const result = await request(
    vendureApi(locale),
    ActiveOrderQuery
  );
  const order = readFragment(ActiveOrderFragment, result.activeOrder);
  $activeOrder.set(order);
  return order;
}
