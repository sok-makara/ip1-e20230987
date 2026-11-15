<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from './stores/session'

const session = useSessionStore()
const router = useRouter()

function logout() {
  session.logout()
  router.push('/login')
}
</script>

<template>
  <header class="nav">
    <RouterLink class="logo" to="/products">Shop Inventory</RouterLink>
    <nav class="links">
      <RouterLink to="/products">Product</RouterLink>
      <RouterLink to="/stock">Stock In/Out</RouterLink>
      <RouterLink to="/low-stock">Low Stock</RouterLink>
      <RouterLink to="/report">Report</RouterLink>
    </nav>
    <div class="user">
      <RouterLink v-if="!session.user" class="btn btn-primary" to="/login">LOG IN</RouterLink>
      <template v-else>
        <span class="role">{{ session.roleLabel }}</span>
        <span class="avatar">{{ session.user.username.slice(0, 2).toUpperCase() }}</span>
        <button class="link" type="button" @click="logout">Log out</button>
      </template>
    </div>
  </header>
  <main class="content">
    <RouterView />
  </main>
</template>
