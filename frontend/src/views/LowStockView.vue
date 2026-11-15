<script setup lang="ts">
import { onMounted } from 'vue'
import StateBox from '../components/StateBox.vue'
import { useProductStore } from '../stores/products'
import { stockStatus } from '../utils/stock'

// US-07: the list comes from the store, so it changes when stock changes on another page
const store = useProductStore()
onMounted(() => store.load())
</script>

<template>
  <div class="page-head">
    <div>
      <h1>Low Stock</h1>
      <p class="sub">Products at or below their minimum level</p>
    </div>
    <span v-if="store.lowStock.length > 0" class="pill pill-low">{{ store.lowStock.length }} products need restocking</span>
  </div>

  <StateBox :loading="store.loading" :error="store.error" :empty="store.lowStock.length === 0" empty-text="All products are above minimum stock" @retry="store.load(true)">
    <div class="card table-card">
      <table>
        <thead>
          <tr><th>Code</th><th>Product</th><th>Category</th><th>Stock</th><th>Minimum</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in store.lowStock" :key="p.id">
            <td>{{ p.code }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td>{{ p.quantity }}</td>
            <td>{{ p.minimumLevel }}</td>
            <td>
              <span class="pill" :class="stockStatus(p.quantity, p.minimumLevel).cls">{{ stockStatus(p.quantity, p.minimumLevel).label }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </StateBox>
</template>
