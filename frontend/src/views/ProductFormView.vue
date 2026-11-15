<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { categories } from '../types'
import type { Category, ProductInput } from '../types'
import { errorMessage } from '../utils/errors'

// One form for Add (/products/new) and Edit (/products/:id/edit).
const route = useRoute()
const router = useRouter()
const store = useProductStore()
const editId = route.params.id ? Number(route.params.id) : null

const code = ref('')
const name = ref('')
const category = ref<Category | ''>('')
const minimum = ref('')
const errors = reactive({ code: '', name: '', category: '', minimum: '', form: '' })
const saving = ref(false)
const notFound = computed(() => editId !== null && store.loaded && !store.getById(editId))

onMounted(async () => {
  await store.load()
  const p = editId !== null ? store.getById(editId) : undefined
  if (p) {
    code.value = p.code
    name.value = p.name
    category.value = p.category
    minimum.value = String(p.minimumLevel)
  }
})

async function save() {
  // client-side validation, messages from US-06 in docs/SPEC.md
  errors.code = code.value.trim() === '' ? 'Code is required' : ''
  errors.name = name.value.trim() === '' ? 'Name is required' : ''
  errors.category = category.value === '' ? 'Please choose a category' : ''
  errors.minimum =
    minimum.value === '' ? 'Minimum stock level is required' : Number(minimum.value) < 0 ? 'Minimum stock level must be 0 or more' : ''
  errors.form = ''
  if (errors.code || errors.name || errors.category || errors.minimum) return

  const input: ProductInput = {
    code: code.value,
    name: name.value,
    category: category.value as Category,
    minimumLevel: Number(minimum.value),
  }
  saving.value = true
  try {
    if (editId !== null) await store.update(editId, input)
    else await store.create(input)
    router.push('/products')
  } catch (e) {
    const msg = errorMessage(e)
    if (msg === 'Product code already exists') errors.code = msg
    else errors.form = msg
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="notFound" class="state">Product not found</div>
  <form v-else class="card" style="max-width: 560px" @submit.prevent="save">
    <h1>{{ editId !== null ? 'Edit product' : 'Add product' }}</h1>
    <div class="field">
      <label for="code">Code</label>
      <input id="code" v-model="code" class="input" :class="{ invalid: errors.code }" type="text" />
      <p v-if="errors.code" class="err">{{ errors.code }}</p>
    </div>
    <div class="field">
      <label for="name">Name</label>
      <input id="name" v-model="name" class="input" :class="{ invalid: errors.name }" type="text" />
      <p v-if="errors.name" class="err">{{ errors.name }}</p>
    </div>
    <div class="field">
      <label for="category">Category</label>
      <select id="category" v-model="category" class="input" :class="{ invalid: errors.category }">
        <option value="">Choose a category</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <p v-if="errors.category" class="err">{{ errors.category }}</p>
    </div>
    <div class="field">
      <label for="minimum">Minimum stock level</label>
      <input id="minimum" v-model="minimum" class="input" :class="{ invalid: errors.minimum }" type="number" />
      <p v-if="errors.minimum" class="err">{{ errors.minimum }}</p>
    </div>
    <p v-if="editId === null" class="sub">New products start with 0 stock. Use Stock In to add stock.</p>
    <p v-if="errors.form" class="err" role="alert">{{ errors.form }}</p>
    <div class="btn-row">
      <button class="btn btn-primary" type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      <RouterLink class="btn" to="/products">Cancel</RouterLink>
    </div>
  </form>
</template>
