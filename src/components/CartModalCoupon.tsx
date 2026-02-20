import { useState } from "react";
import { m } from "../client/store";
import { applyCouponCode, removeCouponCode } from "../client/order-service";

export function CartModalCoupon({ couponCodes }: { couponCodes: string[] }) {
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const locale = window?.__locale;

  async function handleApply() {
    if (!code.trim()) return;
    setHasError(false);
    const error = await applyCouponCode(locale, code.trim());
    if (error) {
      setHasError(true);
    } else {
      setCode("");
    }
  }

  return (
    <div className="collapse-arrow bg-base-200 collapse">
      <input type="checkbox" />
      <div className="collapse-title font-medium">{m.couponCode()}</div>
      <div className="collapse-content space-y-2">
        <div className="join w-full">
          <input
            type="text"
            className="input join-item flex-1"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder={m.couponCode()}
          />
          <button className="btn btn-primary join-item" onClick={handleApply}>
            {m.apply()}
          </button>
        </div>
        {hasError && <p className="text-error text-sm">{m.invalidCouponCode()}</p>}
        {couponCodes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {couponCodes.map((c) => (
              <span key={c} className="badge badge-primary gap-1 rounded-full">
                {c}
                <button
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => removeCouponCode(locale, c)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
