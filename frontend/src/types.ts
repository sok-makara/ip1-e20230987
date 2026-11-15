export type Category = 'Drinks' | 'Snacks' | 'Household'
export const categories: Category[] = ['Drinks', 'Snacks', 'Household']
export type MovementType = 'IN' | 'OUT'
export type Role = 'STAFF' | 'MANAGER'

export interface Product {
  id: number
  code: string
  name: string
  category: Category
  quantity: number
  minimumLevel: number
  image?: string
}
export interface ProductInput {
  code: string
  name: string
  category: Category
  minimumLevel: number
  image?: string
}
export interface Movement {
  id: number
  productId: number
  type: MovementType
  quantity: number
  date: string // YYYY-MM-DD
  reason: string // Sale, Damaged or Expired for OUT; empty for IN
  note: string
  user: string
}
export interface MovementInput {
  productId: number
  type: MovementType
  quantity: number
  reason: string
  note: string
}
export interface ReportRow {
  productId: number
  code: string
  name: string
  category: Category
  totalIn: number
  totalOut: number
}
export interface SessionUser {
  username: string
  role: Role
}
