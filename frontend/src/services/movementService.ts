import { db, simulate, today } from './mockApi'
import type { MovementInput, ReportRow } from '../types'

export const movementService = {
  // movements of one product, newest first (US-05)
  listByProduct: (productId: number) =>
    simulate(() =>
      db.movements
        .filter((m) => m.productId === productId)
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .map((m) => ({ ...m })),
    ),

  // stock in or stock out (US-02, US-03). Returns the updated product.
  record: (input: MovementInput) =>
    simulate(() => {
      const product = db.products.find((p) => p.id === input.productId)
      if (!product) throw new Error('Please choose a product')
      if (!(input.quantity > 0)) throw new Error('Quantity must be more than 0')
      if (input.type === 'OUT' && input.quantity > product.quantity) {
        throw new Error('Not enough stock') // stock can never go below zero
      }
      product.quantity += input.type === 'IN' ? input.quantity : -input.quantity
      db.movements.push({
        id: Math.max(0, ...db.movements.map((m) => m.id)) + 1,
        productId: product.id,
        type: input.type,
        quantity: input.quantity,
        date: today(),
        reason: input.type === 'OUT' ? input.reason : '',
        note: input.note.trim(),
        user: 'staff',
      })
      return { ...product }
    }),

  // total in and out per product between two dates (US-08)
  report: (start: string, end: string) =>
    simulate((): ReportRow[] =>
      db.products
        .map((p) => {
          const inRange = db.movements.filter((m) => m.productId === p.id && m.date >= start && m.date <= end)
          const total = (type: 'IN' | 'OUT') =>
            inRange.filter((m) => m.type === type).reduce((sum, m) => sum + m.quantity, 0)
          return { productId: p.id, code: p.code, name: p.name, category: p.category, totalIn: total('IN'), totalOut: total('OUT') }
        })
        .filter((r) => r.totalIn + r.totalOut > 0),
    ),
}
