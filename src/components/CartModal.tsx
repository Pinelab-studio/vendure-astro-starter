import { useStore } from "@nanostores/react";
import { useEffect, useRef, useState } from "react";
import { $activeOrder, $cartOpen, m } from "../client/store";
import { removeOrderLine } from "../client/order-service";
import { formatMoney } from "../lib/format-money";
import { CartModalCoupon } from "./CartModalCoupon";
import { CartSummary } from "./CartSummary";
import { CartQuantitySelector } from "./CartQuantitySelector";
import { TrashIcon } from "./TrashIcon";

export function CartModal() {
  const activeOrder = useStore($activeOrder);
  const cartOpen = useStore($cartOpen);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (cartOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [cartOpen]);

  function close() {
    $cartOpen.set(false);
  }

  if (!activeOrder || activeOrder.totalQuantity === 0) {
    return (
      <dialog ref={dialogRef} className="modal" onClose={close}>
        <div className="modal-box flex flex-col items-center justify-center">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={close}
          >
            ✕
          </button>
          <p>{m.cartEmpty()}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={close}>
            {m.close()}
          </button>
        </form>
      </dialog>
    );
  }

  const checkoutUrl = `/${window.__locale}/checkout`;

  return (
    <dialog ref={dialogRef} className="modal" onClose={close}>
      <div className="modal-box max-w-2xl p-0">
        <div className="flex items-center gap-2 p-4">
          <a href={checkoutUrl} className="btn btn-primary" onClick={close}>
            {m.checkout()}
          </a>
          <button
            className="btn btn-sm btn-circle btn-ghost ml-auto"
            type="button"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-4 pt-0">
          {activeOrder.lines.map((line) => (
            <div key={line.id} className="flex gap-4">
              {line.featuredAsset && (
                <img
                  src={line.featuredAsset.preview + "?preset=small&format=webp"}
                  alt={line.productVariant.name}
                  className="h-25 w-25 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold">{line.productVariant.name}</h4>
                <p className="text-base-content/70 text-sm">
                  {formatMoney(line.unitPriceWithTax)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="font-semibold">
                  {formatMoney(line.linePriceWithTax)}
                </div>
                <div className="flex items-center gap-1">
                  <RemoveLineButton orderLineId={line.id} />
                  <CartQuantitySelector
                    orderLineId={line.id}
                    quantity={line.quantity}
                  />
                </div>
              </div>
            </div>
          ))}

          <CartSummary order={activeOrder} />

          <CartModalCoupon couponCodes={activeOrder.couponCodes} />

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={close}>
              {m.continueShopping()}
            </button>
            <a href={checkoutUrl} className="btn btn-primary" onClick={close}>
              {m.checkout()}
            </a>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={close}>
          {m.close()}
        </button>
      </form>
    </dialog>
  );
}

function RemoveLineButton({ orderLineId }: { orderLineId: string }) {
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    try {
      await removeOrderLine(window.__locale, orderLineId);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <span className="loading loading-spinner loading-sm" />;
  }

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm btn-square"
      onClick={remove}
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
