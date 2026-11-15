import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { productService } from '../services/productService'
import { movementService } from '../services/movementService'
import { errorMessage } from '../utils/errors'
import type { MovementInput, Product, ProductInput } from '../types'

// Shared data: the product list is used by Products, Stock In/Out, Low Stock and the detail page.
export const useProductStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const lowStock = computed(() => items.value.filter((p) => p.quantity <= p.minimumLevel))
  const getById = (id: number) => items.value.find((p) => p.id === id)

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      items.value = await productService.list()
      loaded.value = true
    } catch (e) {
      error.value = errorMessage(e)
    } finally {
      loading.value = false
    }
  }

  // The actions below let errors reach the page, so the form can show them.
  async function create(input: ProductInput) {
    items.value.push(await productService.create(input))
  }
  async function update(id: number, input: ProductInput) {
    const saved = await productService.update(id, input)
    items.value = items.value.map((p) => (p.id === id ? saved : p))
  }
  async function remove(id: number) {
    await productService.remove(id)
    items.value = items.value.filter((p) => p.id !== id)
  }
  async function recordMovement(input: MovementInput) {
    const updated = await movementService.record(input)
    items.value = items.value.map((p) => (p.id === updated.id ? updated : p))
  }

  return { items, loading, error, loaded, lowStock, getById, load, create, update, remove, recordMovement }
})
