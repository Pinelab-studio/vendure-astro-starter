import { graphql, readFragment, type ResultOf } from "gql.tada";
import { $activeOrder, $cartOpen, $notification } from "./store";
import { ActiveOrderFragment, ActiveOrderQuery, AddItemToOrderMutation } from "./order-queries";
import { getErrorMessage, isErrorResult } from "../lib/error-util";
import { createMessageFn } from "../lib/locale-util";
import { vendureClient } from "./vendure-client";
import { m } from "./store";

export type ActiveOrder = NonNullable<
  ResultOf<typeof ActiveOrderFragment>
>;

/**
 * Fetch the active order from Vendure and persist it in the store.
 */
export async function getActiveOrder(locale: string): Promise<void> {
  const { activeOrder } = await vendureClient(locale).request(
    ActiveOrderQuery
  );
  // `readFragment` has quite some TS overhead, so we handle it like this. which is fine, because it is encapsulated inside the services.
  $activeOrder.set(activeOrder as unknown as ActiveOrder);
}

export async function addItemToOrder(locale: string, productVariantId: string, quantity: number): Promise<void> {
  const { addItemToOrder } = await vendureClient(locale).request(
    AddItemToOrderMutation,
    { productVariantId, quantity }
  ).catch(error => {
    $notification.set({ message: getErrorMessage(error), type: 'error'});
    throw error;
  });
  const error = isErrorResult(addItemToOrder);
  if (error) {
    $notification.set({ message: error.message, type: 'error' });
    return;
  }
  $activeOrder.set(addItemToOrder as unknown as ActiveOrder);
  // Notify, with translated message
  const variant = $activeOrder.get()?.lines[0].productVariant.name!
  $notification.set({
    message: m.itemAddedToCart({ variant }),
    type: "success",
    cta: { text: m.viewCart({}), callback: () => { $cartOpen.set(true); } },
  });
}
