<script setup lang="ts">
// Shows the loading, error or empty state. When none applies it shows its content.
defineProps<{
  loading: boolean
  error: string | null
  empty: boolean
  emptyText: string
}>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state" role="status">Loading...</div>
  <div v-else-if="error" class="state state-error" role="alert">
    <span>{{ error }}</span>
    <button class="btn" type="button" @click="emit('retry')">Try again</button>
  </div>
  <div v-else-if="empty" class="state">{{ emptyText }}</div>
  <slot v-else />
</template>
