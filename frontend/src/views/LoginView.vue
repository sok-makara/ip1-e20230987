<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { useSessionStore } from '../stores/session'
import { errorMessage } from '../utils/errors'

const router = useRouter()
const session = useSessionStore()

// form state stays in the component: only this page needs it
const username = ref('')
const password = ref('')
const errors = reactive({ username: '', password: '', form: '' })
const submitting = ref(false)

async function submit() {
  // client-side validation, messages from US-01 in docs/SPEC.md
  errors.username = username.value.trim() === '' ? 'Username is required' : ''
  errors.password = password.value === '' ? 'Password is required' : ''
  errors.form = ''
  if (errors.username || errors.password) return

  submitting.value = true
  try {
    session.login(await authService.login(username.value.trim(), password.value))
    router.push('/products')
  } catch (e) {
    errors.form = errorMessage(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="card" @submit.prevent="submit">
      <h1>Welcome back</h1>
      <p class="sub">Log in to manage the mart stock</p>
      <div class="field">
        <label for="username">Username</label>
        <input id="username" v-model="username" class="input" :class="{ invalid: errors.username }" type="text" placeholder="Enter your username" />
        <p v-if="errors.username" class="err">{{ errors.username }}</p>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" v-model="password" class="input" :class="{ invalid: errors.password }" type="password" placeholder="Enter your password" />
        <p v-if="errors.password" class="err">{{ errors.password }}</p>
      </div>
      <p v-if="errors.form" class="err" role="alert">{{ errors.form }}</p>
      <button class="btn btn-primary btn-block" type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Log in' }}
      </button>
      <p class="sub" style="font-size: 13px">Practice accounts: staff / staff123 and manager / manager123</p>
    </form>
  </div>
</template>
