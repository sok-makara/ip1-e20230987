<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import StateBox from '../components/StateBox.vue'
import { useProductStore } from '../stores/products'
import { movementService } from '../services/movementService'
import type { Movement } from '../types'
import { stockStatus } from '../utils/stock'
import { errorMessage } from '../utils/errors'

// Route /products/:id. The id comes from the address.
const route = useRoute()
const store = useProductStore()
const id = computed(() => Number(route.params.id))
const product = computed(() => store.getById(id.value))

// the history is only used on this page, so it stays inside the component
const history = ref<Movement[]>([])
const loadingHistory = ref(false)
const historyError = ref<string | null>(null)

async function loadHistory() {
  loadingHistory.value = true
  historyError.value = null
  try {
    history.value = await movementService.listByProduct(id.value)
  } catch (e) {
    historyError.value = errorMessage(e)
  } finally {
    loadingHistory.value = false
  }
}

onMounted(() => {
  store.load()
  loadHistory()
})
watch(id, loadHistory)
</script>

<template>
  <RouterLink class="back" to="/products">&larr; Back to products</RouterLink>
  <StateBox :loading="store.loading" :error="store.error" :empty="!product" empty-text="Product not found" @retry="store.load(true)">
    <template v-if="product">
      <div class="page-head">
        <div>
          <h1>{{ product.name }}</h1>
          <p class="sub">{{ product.code }} - {{ product.category }}</p>
        </div>
        <span class="pill" :class="stockStatus(product.quantity, product.minimumLevel).cls">
          {{ stockStatus(product.quantity, product.minimumLevel).label }}
        </span>
      </div>
      <p>In stock: <strong>{{ product.quantity }}</strong> &nbsp; Minimum: {{ product.minimumLevel }}</p>

      <h2>Movement history</h2>
      <StateBox :loading="loadingHistory" :error="historyError" :empty="history.length === 0" empty-text="No movements yet" @retry="loadHistory">
        <div class="card table-card">
          <table>
            <thead>
              <tr><th>Date</th><th>Type</th><th>Quantity</th><th>Reason</th><th>Note</th><th>By</th></tr>
            </thead>
            <tbody>
              <tr v-for="m in history" :key="m.id">
                <td>{{ m.date }}</td>
                <td>{{ m.type }}</td>
                <td>{{ m.quantity }}</td>
                <td>{{ m.reason || '-' }}</td>
                <td>{{ m.note || '-' }}</td>
                <td>{{ m.user }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </StateBox>
    </template>
  </StateBox>
</template>
