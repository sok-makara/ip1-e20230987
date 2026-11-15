import productsData from '../mock/products.json'
import movementsData from '../mock/movements.json'
import type { Movement, Product } from '../types'

// The "database" of the mock API. It lives in memory, so a page reload resets it.
// In Check 4 the services call the real NestJS API instead.
export const db = {
  products: structuredClone(productsData) as Product[],
  movements: structuredClone(movementsData) as Movement[],
}

// Makes every call asynchronous (shows the loading state).
// Open any page with ?mockError=1 to see the error state.
export async function simulate<T>(work: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (new URLSearchParams(window.location.search).has('mockError')) {
    throw new Error('Cannot reach the server. Please try again.')
  }
  return work()
}

export function today(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}
