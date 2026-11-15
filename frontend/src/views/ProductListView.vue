<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import StateBox from '../components/StateBox.vue'
import { useProductStore } from '../stores/products'
import { categories } from '../types'
import type { Category, Product } from '../types'
import { stockStatus } from '../utils/stock'
import { errorMessage } from '../utils/errors'

const store = useProductStore()

// list data is in the store; search, filter and page number are only this page's business
const search = ref('')
const category = ref<Category | 'All'>('All')
const page = ref(1)
const pageSize = 10
const actionError = ref('')
const filters: (Category | 'All')[] = ['All', ...categories]

onMounted(() => store.load())

const filtered = computed(() => {
  const text = search.value.trim().toLowerCase()
  return store.items.filter(
    (p) =>
      (category.value === 'All' || p.category === category.value) &&
      (p.name.toLowerCase().includes(text) || p.code.toLowerCase().includes(text)),
  )
})
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pageItems = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([search, category], () => {
  page.value = 1
})

async function remove(p: Product) {
  if (!confirm(`Delete "${p.name}"?`)) return // US-06: ask before deleting
  actionError.value = ''
  try {
    await store.remove(p.id)
    if (page.value > pageCount.value) page.value = pageCount.value
  } catch (e) {
    actionError.value = errorMessage(e)
  }
}
</script>

<template>
  <div class="page-head">
    <div>
      <h1>Products</h1>
      <p class="sub">Drinks, snacks and household items in the mart</p>
    </div>
    <div>
      <RouterLink class="btn btn-primary" to="/products/new">+ Add Product</RouterLink>
      <p class="caption">Manager only</p>
    </div>
  </div>

  <div class="card toolbar">
    <input v-model="search" class="input search" type="text" placeholder="Search by name or code of products" />
    <button v-for="c in filters" :key="c" class="chip" :class="{ on: category === c }" type="button" @click="category = c">
      {{ c }}
    </button>
  </div>
  <p v-if="actionError" class="err" role="alert">{{ actionError }}</p>

  <StateBox :loading="store.loading" :error="store.error" :empty="filtered.length === 0" empty-text="No products found" @retry="store.load(true)">
    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Minimum</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pageItems" :key="p.id">
            <td>{{ p.code }}</td>
            <td>
              <div class="product-cell">
                <img v-if="p.image" class="thumb" :src="p.image" :alt="p.name" />
                <span v-else class="thumb thumb-empty">{{ p.name[0] }}</span>
                {{ p.name }}
              </div>
            </td>
            <td>{{ p.category }}</td>
            <td>{{ p.quantity }}</td>
            <td>{{ p.minimumLevel }}</td>
            <td>
              <span class="pill" :class="stockStatus(p.quantity, p.minimumLevel).cls">{{ stockStatus(p.quantity, p.minimumLevel).label }}</span>
            </td>
            <td>
              <div class="actions">
                <RouterLink class="link blue" :to="`/products/${p.id}`">History</RouterLink>
                <RouterLink class="link" :to="`/products/${p.id}/edit`">Edit</RouterLink>
                <button class="link red" type="button" @click="remove(p)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pager">
      <button class="btn" type="button" :disabled="page <= 1" @click="page--">Previous</button>
      <span>Page {{ page }} of {{ pageCount }}</span>
      <button class="btn" type="button" :disabled="page >= pageCount" @click="page++">Next</button>
    </div>
  </StateBox>
</template>
