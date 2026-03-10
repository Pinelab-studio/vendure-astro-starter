import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "../lib/debounce";
import {
  type ShippingMethodQuote,
  addPaymentToOrder,
  getEligibleShippingMethods,
  setCustomerForOrder,
  setOrderShippingAddress,
  setOrderShippingMethod,
  transitionOrderToState,
} from "../client/order-service";
import type { AvailableCountry } from "../server/global-settings-service";
import { $activeOrder, $notification, m } from "../client/store";
import { formatMoney } from "../lib/format-money";
import { CartSummary } from "./CartSummary";

export function CheckoutForm({
  availableCountries,
}: {
  availableCountries: AvailableCountry[];
}) {
  const [eligibleShippingMethods, setEligibleShippingMethods] = useState<
    ShippingMethodQuote[]
  >([]);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<string>("");
  const [loading, setLoading] = useState(false);

  // Set selected shipping method in form based on order and eligible shipping methods
  useEffect(() => {
    refreshAndSelectDefaultShippingMethod();
  }, []);

  if (!$activeOrder.get()?.totalQuantity) {
    return (
      <div className="py-12 text-center">
        <p className="text-base-content/70 mb-12">{m.cartEmpty({})}</p>
        <a href="/" className="btn btn-primary">
          {" "}
          Home
        </a>
      </div>
    );
  }

  const addr = $activeOrder.get()?.shippingAddress;

  /**
   * Set customer on order (email only). Accepts form so it's safe to call from debounced handler (event is recycled).
   */
  async function handleCustomerFormSubmit(form: HTMLFormElement) {
    setLoading(true);
    try {
      const locale = window.__locale;
      const formData = new FormData(form);
      const email = (formData.get("email") as string) ?? "";
      if (!email) return;
      const currentOrder = $activeOrder.get();
      await setCustomerForOrder(locale, {
        firstName: currentOrder?.customer?.firstName ?? "",
        lastName: currentOrder?.customer?.lastName ?? "",
        emailAddress: email,
      });
      // Update selected shipping method because it may have changed due to the customer form submission
      await refreshAndSelectDefaultShippingMethod();
    } catch (err: unknown) {
      $notification.set({
        message: (err as Error)?.message ?? "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Debounce the customer form submit by 300ms
   */
  const debounceHandleCustomerFormSubmit = useMemo(
    () => debounce(handleCustomerFormSubmit, 300),
    [],
  );

  /**
   * Set shipping and billing address. Accepts form so it's safe to call from debounced handler (event is recycled).
   */
  async function handleAddressFormSubmit(form: HTMLFormElement) {
    setLoading(true);
    const locale = window.__locale;
    const formData = new FormData(form);
    const get = (key: string) => (formData.get(key) as string) ?? "";
    try {
      const firstName = get("firstName");
      const lastName = get("lastName");
      const currentOrder = $activeOrder.get();
      await setCustomerForOrder(locale, {
        firstName,
        lastName,
        emailAddress: currentOrder?.customer?.emailAddress ?? "",
      });
      await setOrderShippingAddress(locale, {
        fullName: [firstName, lastName].filter(Boolean).join(" "),
        company: get("company") || undefined,
        streetLine1: get("streetLine1"),
        streetLine2: get("streetLine2") || undefined,
        city: get("city"),
        postalCode: get("postalCode"),
        countryCode: get("countryCode"),
      });
      // Update selected shipping method because it may have changed due to the customer form submission
      await refreshAndSelectDefaultShippingMethod();
    } catch (err: unknown) {
      $notification.set({
        message: (err as Error)?.message ?? "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const debounceHandleAddressFormSubmit = useMemo(
    () => debounce(handleAddressFormSubmit, 300),
    [],
  );

  /**
   * Update the shipping method on the order in Vendure
   */
  async function handleSelectShippingMethod(methodId: string) {
    const locale = window.__locale;
    setLoading(true);
    try {
      setSelectedShippingMethod(methodId);
      await setOrderShippingMethod(locale, methodId);
    } catch (e: any) {
      $notification.set({
        message: e?.message ?? "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Gets the eligible shipping methods for the current order and
   * selects the first method if no eligible method is currently selected on the order
   */
  async function refreshAndSelectDefaultShippingMethod() {
    const locale = window.__locale;
    const eligibleMethods = await getEligibleShippingMethods(locale);
    setEligibleShippingMethods(eligibleMethods);
    // Use current order from store (closure 'order' can be stale after address/method updates)
    const currentOrder = $activeOrder.get();
    let selectedMethodId = eligibleMethods.find(
      (m) => m.id === currentOrder?.shippingLines?.[0]?.shippingMethod?.id,
    )?.id;
    if (!selectedMethodId) {
      // If the order's shipping method is not currently eligible, select the first method
      selectedMethodId = eligibleMethods[0].id;
    }
    setSelectedShippingMethod(selectedMethodId);
    await setOrderShippingMethod(locale, selectedMethodId);
  }

  const order = useStore($activeOrder);
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
      {/* Left column div */}
      <div>
        {/* Contact information */}
        <form
          id="customer-form"
          onSubmit={(e) => {
            e.preventDefault();
            debounceHandleCustomerFormSubmit(e.currentTarget);
          }}
          onChange={(e) => e.currentTarget.requestSubmit()}
        >
          <h2 className="text-lg">{m.checkout_contactInformation({})}</h2>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm">
              {m.checkout_emailAddress({})}
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                defaultValue={order?.customer?.emailAddress ?? ""}
                className="input border-base-content/20 w-full border"
              />
            </div>
          </div>
        </form>

        {/* Shipping and billing address */}
        <form
          id="address-form"
          onSubmit={(e) => {
            e.preventDefault();
            debounceHandleAddressFormSubmit(e.currentTarget);
          }}
          onChange={(e) => {
            const form = e.currentTarget;
            const requiredFields = Array.from(
              form.querySelectorAll("[required]"),
            ) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
            const allFilled = requiredFields.every(
              (field) => field.value.trim().length > 0,
            );
            if (allFilled) {
              form.requestSubmit();
            }
          }}
          className="mt-6"
        >
          <h2 className="text-lg">{m.checkout_shippingInformation({})}</h2>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="firstName" className="block text-sm">
                {m.checkout_firstName({})}
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  defaultValue={order?.customer?.firstName ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm">
                {m.checkout_lastName({})}
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  defaultValue={order?.customer?.lastName ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm">
                {m.checkout_company({})}
              </label>
              <div className="mt-2">
                <input
                  id="company"
                  type="text"
                  name="company"
                  defaultValue={addr?.company ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm">
                {m.checkout_postalCode({})}
              </label>
              <div className="mt-2">
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  autoComplete="postal-code"
                  required
                  defaultValue={addr?.postalCode ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div>
              <label htmlFor="streetLine2" className="block text-sm">
                {m.checkout_houseNumber({})}
              </label>
              <div className="mt-2">
                <input
                  id="streetLine2"
                  type="text"
                  name="streetLine2"
                  required
                  defaultValue={addr?.streetLine2 ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="streetLine1" className="block text-sm">
                {m.checkout_address({})}
              </label>
              <div className="mt-2">
                <input
                  id="streetLine1"
                  type="text"
                  name="streetLine1"
                  autoComplete="street-address"
                  required
                  defaultValue={addr?.streetLine1 ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm">
                {m.checkout_city({})}
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  required
                  defaultValue={addr?.city ?? ""}
                  className="input border-base-content/20 w-full border"
                />
              </div>
            </div>
            <div>
              <label htmlFor="countryCode" className="block text-sm">
                {m.checkout_country({})}
              </label>
              <div className="mt-2">
                <select
                  id="countryCode"
                  name="countryCode"
                  autoComplete="country"
                  required
                  defaultValue={addr?.countryCode ?? "NL"}
                  className="select border-base-content/20 w-full border"
                >
                  {availableCountries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Delivery method */}
        {eligibleShippingMethods.length > 0 && (
          <div className="border-base-300 mt-10 border-t pt-10">
            <fieldset>
              <legend className="text-lg">
                {m.checkout_deliveryMethod({})}
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {eligibleShippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`group relative flex cursor-pointer rounded-lg border p-4 ${
                      selectedShippingMethod === method.id
                        ? "border-primary ring-primary ring-2"
                        : "border-base-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.id}
                      checked={selectedShippingMethod === method.id}
                      onChange={() => handleSelectShippingMethod(method.id)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <span className="block text-sm">{method.name}</span>
                      {method.description && (
                        <span className="text-base-content/60 mt-1 block text-sm">
                          {method.description}
                        </span>
                      )}
                      <span className="mt-6 block text-sm">
                        {formatMoney(method.priceWithTax)}
                      </span>
                    </div>
                    {selectedShippingMethod === method.id && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-primary size-5"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="mt-10 lg:mt-0">
        <h2 className="text-lg">{m.orderSummary({})}</h2>
        <div className="my-6 space-y-4">
          {order.lines.map((line) => (
            <div key={line.id} className="flex gap-4">
              <div className="flex-1">
                <h4 className="font-semibold">{line.productVariant.name}</h4>
                <p className="text-base-content/70 text-sm">
                  {line.quantity} × {formatMoney(line.unitPriceWithTax)}
                </p>
              </div>
              <div className="font-semibold">
                {formatMoney(line.linePriceWithTax)}
              </div>
            </div>
          ))}

          <CartSummary order={order} />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />{" "}
                {m.checkout_processing({})}
              </>
            ) : (
              m.checkout_confirmOrder({})
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
