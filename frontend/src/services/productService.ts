import { db, simulate } from './mockApi'
import type { Product, ProductInput } from '../types'

const copy = (p: Product): Product => ({ ...p })
const codeTaken = (code: string, ignoreId?: number) =>
  db.products.some((p) => p.code.toLowerCase() === code.trim().toLowerCase() && p.id !== ignoreId)

export const productService = {
  list: () => simulate(() => db.products.map(copy)),

  get: (id: number) =>
    simulate(() => {
      const p = db.products.find((x) => x.id === id)
      if (!p) throw new Error('Product not found')
      return copy(p)
    }),

  create: (input: ProductInput) =>
    simulate(() => {
      if (codeTaken(input.code)) throw new Error('Product code already exists')
      const product: Product = {
        id: Math.max(0, ...db.products.map((p) => p.id)) + 1,
        code: input.code.trim(),
        name: input.name.trim(),
        category: input.category,
        quantity: 0, // stock arrives through Stock In
        minimumLevel: input.minimumLevel,
      }
      db.products.push(product)
      return copy(product)
    }),

  update: (id: number, input: ProductInput) =>
    simulate(() => {
      const p = db.products.find((x) => x.id === id)
      if (!p) throw new Error('Product not found')
      if (codeTaken(input.code, id)) throw new Error('Product code already exists')
      p.code = input.code.trim()
      p.name = input.name.trim()
      p.category = input.category
      p.minimumLevel = input.minimumLevel
      return copy(p)
    }),

  remove: (id: number) =>
    simulate(() => {
      db.products = db.products.filter((p) => p.id !== id)
    }),
}
