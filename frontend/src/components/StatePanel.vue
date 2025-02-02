<template>
  <div class="flex flex-col justify-center">
    <div class="flex flex-row justify-center">
      <span class="text-4xl">{{
        store.state.isOffline ? 'OFFLINE' : currentState
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import { computed } from 'vue'

const store = useAlarmStore()

const currentState = computed(() => {
  return store.state.current
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((token) => {
      return token.substring(0, 1).toLocaleUpperCase() + token.substring(1)
    })
    .join(' ')
})
</script>
