export function formatMoney(amount: number): string {
    return `€ ${(amount / 100).toFixed(2)}`;
  }