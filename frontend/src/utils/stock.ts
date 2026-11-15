// Stock status shown as a coloured pill (same rule as the Low Stock page).
export function stockStatus(stock: number, minimum: number) {
  if (stock === 0) return { label: 'Out of stock', cls: 'pill-out' }
  if (stock <= minimum) return { label: 'Low stock', cls: 'pill-low' }
  return { label: 'In stock', cls: 'pill-ok' }
}
