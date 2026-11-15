<script setup lang="ts">
import { ref } from 'vue'
import StateBox from '../components/StateBox.vue'
import { movementService } from '../services/movementService'
import type { ReportRow } from '../types'
import { errorMessage } from '../utils/errors'

// The report result is used only here, so it stays in the component (not in the store).
const startDate = ref('2026-11-01')
const endDate = ref('2026-11-14')
const formError = ref('')
const rows = ref<ReportRow[]>([])
const searched = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function show() {
  formError.value = ''
  if (startDate.value === '') formError.value = 'Start date is required'
  else if (endDate.value === '') formError.value = 'End date is required'
  else if (endDate.value < startDate.value) formError.value = 'End date must be after start date' // US-08
  if (formError.value) return

  searched.value = true
  loading.value = true
  error.value = null
  try {
    rows.value = await movementService.report(startDate.value, endDate.value)
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-head">
    <div>
      <h1>Stock Movement Report</h1>
      <p class="sub">Total stock in and out for each product</p>
    </div>
  </div>

  <form class="card filters" @submit.prevent="show">
    <div class="field">
      <label for="start">Start date</label>
      <input id="start" v-model="startDate" class="input" type="date" />
    </div>
    <div class="field">
      <label for="end">End date</label>
      <input id="end" v-model="endDate" class="input" type="date" />
    </div>
    <button class="btn btn-primary" type="submit">Show Report</button>
  </form>
  <p v-if="formError" class="err" role="alert">{{ formError }}</p>

  <StateBox v-if="searched" :loading="loading" :error="error" :empty="rows.length === 0" empty-text="No movements between these dates" @retry="show">
    <div class="card table-card">
      <table>
        <thead>
          <tr><th>Code</th><th>Product</th><th>Category</th><th>Total in</th><th>Total out</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.productId">
            <td>{{ r.code }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.category }}</td>
            <td>{{ r.totalIn }}</td>
            <td>{{ r.totalOut }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </StateBox>
</template>
