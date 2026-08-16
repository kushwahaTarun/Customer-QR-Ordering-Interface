export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function computeTax(subtotal: number, taxRate: number) {
  return Math.round(subtotal * taxRate);
}

export function computeTotals(
  subtotal: number,
  taxRate: number,
  discount = 0,
) {
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
  const taxable = Math.max(subtotal - safeDiscount, 0);
  const tax = computeTax(taxable, taxRate);
  return {
    subtotal,
    discount: safeDiscount,
    tax,
    total: taxable + tax,
  };
}
