<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import StateBox from '../components/StateBox.vue'
import { useProductStore } from '../stores/products'
import type { MovementType } from '../types'
import { stockStatus } from '../utils/stock'
import { errorMessage } from '../utils/errors'

const router = useRouter()
const store = useProductStore()

// form fields stay in the component; the stock numbers they change live in the store
const productId = ref(0) // 0 = nothing chosen
const type = ref<MovementType>('IN')
const quantity = ref('')
const reason = ref('Sale')
const note = ref('')
const errors = reactive({ product: '', quantity: '', form: '' })
const saving = ref(false)
const success = ref('')

onMounted(() => store.load())

const selected = computed(() => store.getById(productId.value))
const status = computed(() => (selected.value ? stockStatus(selected.value.quantity, selected.value.minimumLevel) : null))

async function save() {
  errors.product = productId.value === 0 ? 'Please choose a product' : ''
  const qty = Number(quantity.value)
  errors.quantity = quantity.value === '' || !(qty > 0) ? 'Quantity must be more than 0' : ''
  errors.form = ''
  success.value = ''
  if (errors.product || errors.quantity) return

  saving.value = true
  try {
    await store.recordMovement({ productId: productId.value, type: type.value, quantity: qty, reason: reason.value, note: note.value })
    success.value = `Saved. ${selected.value?.name} now has ${selected.value?.quantity} in stock.`
    quantity.value = ''
    note.value = ''
  } catch (e) {
    const msg = errorMessage(e)
    if (msg === 'Not enough stock' || msg.startsWith('Quantity')) errors.quantity = msg
    else errors.form = msg
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page-head">
    <div>
      <h1>Stock In / Out</h1>
      <p class="sub">Record goods coming in or going out of the mart</p>
    </div>
  </div>

  <StateBox :loading="store.loading" :error="store.error" :empty="store.items.length === 0" empty-text="No products yet. Add a product first." @retry="store.load(true)">
    <div class="grid5">
      <form class="card span3" style="padding: 28px; gap: 18px" @submit.prevent="save">
        <div class="field">
          <label for="product">Product</label>
          <select id="product" v-model.number="productId" class="input" :class="{ invalid: errors.product }">
            <option :value="0">Choose a product</option>
            <option v-for="p in store.items" :key="p.id" :value="p.id">{{ p.code }} - {{ p.name }}</option>
          </select>
          <p v-if="errors.product" class="err">{{ errors.product }}</p>
        </div>
        <div class="field">
          <span class="label">Type</span>
          <div class="seg">
            <button type="button" :class="{ on: type === 'IN' }" @click="type = 'IN'">In</button>
            <button type="button" :class="{ on: type === 'OUT' }" @click="type = 'OUT'">Out</button>
          </div>
        </div>
        <div class="field">
          <label for="quantity">Quantity</label>
          <input id="quantity" v-model="quantity" class="input" :class="{ invalid: errors.quantity }" type="number" placeholder="0" />
          <p v-if="errors.quantity" class="err">{{ errors.quantity }}</p>
        </div>
        <div class="field">
          <label for="reason">Reason (only for Out)</label>
          <select id="reason" v-model="reason" class="input" :disabled="type === 'IN'">
            <option>Sale</option>
            <option>Damaged</option>
            <option>Expired</option>
          </select>
        </div>
        <div class="field">
          <label for="note">Note</label>
          <textarea id="note" v-model="note" class="input" rows="3" placeholder="Optional note"></textarea>
        </div>
        <p v-if="errors.form" class="err" role="alert">{{ errors.form }}</p>
        <p v-if="success" class="ok" role="status">{{ success }}</p>
        <div class="btn-row">
          <button class="btn btn-primary" type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
          <button class="btn" type="button" @click="router.push('/products')">Cancel</button>
        </div>
      </form>

      <div class="card span2" style="padding: 28px; gap: 12px">
        <h2>Selected product</h2>
        <template v-if="selected && status">
          <p style="font-weight: 600; font-size: 16px">{{ selected.name }}</p>
          <p class="sub" style="margin: 0">{{ selected.code }} - {{ selected.category }}</p>
          <p>In stock: {{ selected.quantity }} &nbsp;&nbsp; Minimum: {{ selected.minimumLevel }}</p>
          <div><span class="pill" :class="status.cls">{{ status.label }}</span></div>
        </template>
        <p v-else class="sub">Choose a product to see its stock.</p>
        <h3>Rules</h3>
        <div class="rules">
          <p>Stock In adds to the quantity.</p>
          <p>Stock Out subtracts, and can never go below zero.</p>
          <p>Quantity must be more than 0.</p>
        </div>
      </div>
    </div>
  </StateBox>
</template>
