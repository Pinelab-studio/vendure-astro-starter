import { formatMoney } from "../lib/format-money";
import { m } from "../client/store";
import type { ActiveOrder } from "../client/order-service";

export function CartSummary({ order, className }: { order: ActiveOrder | null, className?: string }) {
  const subTotalWithoutDiscounts = order?.lines.reduce((acc, line) => acc + line.linePriceWithTax, 0) ?? 0;
  return (
    <div className={`rounded-box space-y-2 p-4 ${className}`}>
      <div className="flex justify-between">
        <span>{m.subtotal()}</span>
        <span>{formatMoney(subTotalWithoutDiscounts)}</span>
      </div>
      {order?.discounts?.map((discount, i) => (
        <div key={i} className="flex justify-between text-success">
          <span>{discount.description}</span>
          <span>{formatMoney(discount.amountWithTax)}</span>
        </div>
      ))}
      {order?.shippingWithTax != undefined && (
        <div className="flex justify-between">
          <span>{m.shipping()}</span>
          <span>{formatMoney(order?.shippingWithTax)}</span>
        </div>
      )}
      <div className="divider my-0"></div>
      <div className="flex justify-between text-lg font-bold">
        <span>{m.total()}</span>
        <span>{formatMoney(order?.totalWithTax ?? 0)}</span>
      </div>
    </div>
  );
}
