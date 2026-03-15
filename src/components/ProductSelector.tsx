import { useMemo, useState } from "react";
import type { ProductDetail } from "../lib/server/product-service";
import { formatMoney } from "../lib/util/format-money";
import { addItemToOrder } from "../lib/client/order-service";
import { QuantitySelector } from "./QuantitySelector";

type ProductSelectorProps = {
  product: ProductDetail;
  addToCartLabel: string;
  soldOutLabel: string;
  moreLabel: string;
};

export function ProductSelector({
  product,
  addToCartLabel,
  soldOutLabel,
  moreLabel,
}: ProductSelectorProps) {
  // Use the lowest-priced variant as a stable default. UseMemo because we can potentially have a lot of variants.
  const defaultVariant = useMemo(() => {
    if (product.variants.length === 0) {
      return undefined;
    }
    return product.variants.reduce((lowest, variant) =>
      variant.priceWithTax < lowest.priceWithTax ? variant : lowest,
    );
  }, [product.variants]);

  // Map of optionGroupId -> optionId for the current selection
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    if (defaultVariant) {
      for (const option of defaultVariant.options) {
        initial[option.group.id] = option.id;
      }
    }
    return initial;
  });

  // Derive the currently "active" variant and whether the exact selection is sold out
  const { currentVariant, soldOut } = useMemo(() => {
    if (product.variants.length === 0) {
      return { currentVariant: undefined, soldOut: true };
    }

    const groupIds = Object.keys(selectedOptions);

    let exactMatch = undefined;
    let partialMatch = undefined;

    if (groupIds.length > 0) {
      exactMatch = product.variants.find((variant) => {
        if (variant.options.length !== groupIds.length) return false;
        return variant.options.every(
          (option) => selectedOptions[option.group.id] === option.id,
        );
      });

      if (!exactMatch) {
        partialMatch = product.variants.find((variant) =>
          variant.options.every((option) => {
            const selected = selectedOptions[option.group.id];
            return !selected || selected === option.id;
          }),
        );
      }
    }

    // Only consider the selection "complete" when every option group has a selection
    const allGroupsSelected =
      product.optionGroups.length > 0 &&
      groupIds.length === product.optionGroups.length;

    // Fallback to a safe variant so the UI always has something to show
    const fallbackVariant = defaultVariant ?? product.variants[0];

    return {
      currentVariant: exactMatch ?? partialMatch ?? fallbackVariant,
      soldOut: allGroupsSelected && !exactMatch,
    };
  }, [
    defaultVariant,
    product.optionGroups.length,
    product.variants,
    selectedOptions,
  ]);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Update the selected option for a single option group
  async function handleSelectOption(groupId: string, optionId: string) {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  }

  // Add the currently selected variant to the active order
  async function handleAddToCart() {
    if (!currentVariant || typeof window === "undefined") return;
    const locale = window.__locale;
    setAdding(true);
    try {
      await addItemToOrder(locale, currentVariant.id, quantity);
    } finally {
      setAdding(false);
    }
  }

  const price =
    currentVariant?.priceWithTax ?? defaultVariant?.priceWithTax ?? 0;

  return (
    <div className="mt-6 space-y-6">
      <p
        className={`text-3xl tracking-tight ${
          soldOut ? "text-base-content/40 line-through" : "text-base-content"
        }`}
      >
        {formatMoney(price)} {soldOut ? `(${soldOutLabel})` : ""}
      </p>

      {product.optionGroups.length > 0 && (
        <div className="flex flex-wrap gap-8">
          {product.optionGroups.map((group) => (
            <div key={group.id} className="flex flex-col">
              <h3 className="text-base-content/70 text-sm font-medium">
                {group.name}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isSelected = selectedOptions[group.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`btn btn-sm ${
                        isSelected ? "border-base-content" : "border-base-300"
                      }`}
                      onClick={() => handleSelectOption(group.id, option.id)}
                    >
                      {option.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QuantitySelector
          moreLabel={moreLabel}
          quantity={quantity}
          onQuantityChange={setQuantity}
          className="h-10 shrink-0"
        />
        <button
          type="button"
          className="btn btn-primary min-w-0 flex-1"
          onClick={handleAddToCart}
          disabled={adding || !currentVariant || soldOut}
        >
          {adding ? (
            <span className="loading loading-spinner loading-sm" />
          ) : soldOut ? (
            `${soldOutLabel}`
          ) : (
            addToCartLabel
          )}
        </button>
      </div>
    </div>
  );
}
