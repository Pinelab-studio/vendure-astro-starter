import type { ActiveOrder } from "./order-service";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";
import type { Notification } from "../../components/Notification";
import {
  createMessageFn,
  type LocaleMessageFunctions,
} from "../util/locale-util";
import type { Messages } from "../../translations";

/**
 * Active order store. Will always contain the latest active order.
 */
export const $activeOrder = persistentAtom<ActiveOrder | null>(
  "activeOrder",
  null,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

/**
 * Global notification store. Will contain the latest notification.
 */
export const $notification = atom<Notification | null>(null);

/**
 * Controls whether the cart modal is visible.
 */
export const $cartOpen = atom<boolean>(false);

/**
 * Saved checkout details (customer + address) when "remember me" is checked.
 * Used to pre-fill the checkout form on next visit.
 */
export interface SavedCheckoutDetails {
  emailAddress: string;
  firstName: string;
  lastName: string;
  company: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  postalCode: string;
  countryCode: string;
}

export const $savedCheckoutDetails =
  persistentAtom<SavedCheckoutDetails | null>("savedCheckoutDetails", null, {
    encode: JSON.stringify,
    decode: JSON.parse,
  });

/**
 * Message function to get translated messages for the current locale.
 * Should only be used on the client side! For server-side, use Astro.locals.m
 *
 * Example: `m.itemAddedToCart({ variant: "T-Shirt" })` returns `T-Shirt added to cart`
 */
export const m =
  typeof window !== "undefined"
    ? createMessageFn(window.__messages)
    : // Type assertion because this will always be used client-side
      (undefined as unknown as LocaleMessageFunctions<Messages>);
