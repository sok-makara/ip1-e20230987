import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { SessionUser } from '../types'

// Shared by the whole app (top bar, later the route guards): who is logged in.
export const useSessionStore = defineStore('session', () => {
  const user = ref<SessionUser | null>(null)
  const roleLabel = computed(() => (user.value ? (user.value.role === 'STAFF' ? 'Staff' : 'Manager') : null))

  function login(u: SessionUser) {
    user.value = u
  }
  function logout() {
    user.value = null
  }
  return { user, roleLabel, login, logout }
})
