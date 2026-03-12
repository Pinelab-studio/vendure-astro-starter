export function formatMoney(amount: number): string {
  return (
    "€ " +
    (amount / 100).toLocaleString("nl-NL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
