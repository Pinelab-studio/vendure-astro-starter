export function getLowestPrice(variants: { priceWithTax: number }[]): number {
  return Math.min(...variants.map((variant) => variant.priceWithTax));
}
