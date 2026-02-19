import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { ShoppingBag } from "./icons/ShoppingBag";
import { $activeOrder, $cartOpen } from "../client/store";

export function Cart() {
  const activeOrder = useStore($activeOrder);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  // Use 0 until after hydration so server and client match (avoids hydration mismatch from persistentAtom/localStorage)
  const totalQuantity = mounted ? (activeOrder?.totalQuantity ?? 0) : undefined;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    $cartOpen.set(true);
  }

  return (
    <button
      onClick={handleClick}
      className="link link-hover text-neutral-content relative inline-flex"
    >
      <ShoppingBag className="size-6" />
      <span className="absolute -top-1.5 -right-3 badge badge-sm min-w-5 h-5 flex items-center justify-center p-0 rounded-full">
        {totalQuantity === undefined ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          totalQuantity
        )}
      </span>
    </button>
  );
}
