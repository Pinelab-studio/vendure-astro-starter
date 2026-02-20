import { useEffect, useState } from "react";
import { adjustOrderLine, removeOrderLine } from "../client/order-service";
import { m } from "../client/store";

interface QuantitySelectorProps {
  orderLineId: string;
  quantity: number;
  className?: string;
}

const MAX_SELECT = 10;

/**
 * A quantity selector for the cart modal.
 * Shows 0-10 as select, and "more" as number input.
 */
export function CartQuantitySelector({
  orderLineId,
  quantity,
  className,
}: QuantitySelectorProps) {
  const [manualMode, setManualMode] = useState(quantity > MAX_SELECT);
  const locale = window.__locale;

  useEffect(() => {
    setManualMode(quantity > MAX_SELECT);
  }, [quantity]);

  async function update(newQuantity: number) {
    if (newQuantity <= 0) {
      await removeOrderLine(locale, orderLineId);
    } else {
      await adjustOrderLine(locale, orderLineId, newQuantity);
    }
  }
  if (manualMode) {
    return (
      <input
        name="quantity"
        type="number"
        className={`input input-sm border-base-content/20 h-8 w-20 rounded border text-center ${className ?? ""}`}
        defaultValue={quantity}
        min={1}
        autoFocus
        onBlur={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val > 0) update(val);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    );
  }

  return (
    <select
      className={`border-base-content/20 rounded border px-1 py-1 text-sm ${className ?? ""}`}
      value={quantity}
      onChange={(e) => {
        const val = e.target.value;
        if (val === "more") {
          setManualMode(true);
        } else {
          update(parseInt(val, 10));
        }
      }}
    >
      {Array.from({ length: MAX_SELECT }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
      <option value="more">{m.more()}</option>
    </select>
  );
}
