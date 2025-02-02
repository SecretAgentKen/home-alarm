<template>
  <div class="flex flex-row gap-2 p-2">
    <button
      class="btn btn-big flex-1 bg-red-400"
      :disabled="armDisabled"
      @click="emit('arm')"
    >
      Arm
    </button>
    <button
      class="btn btn-big flex-1 bg-blue-400"
      :disabled="disarmDisabled"
      @click="emit('disarm')"
    >
      Disarm
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'disarm'): void
  (e: 'arm'): void
}>()

const store = useAlarmStore()

const armDisabled = computed(() => {
  return (
    store.state.current !== 'disarmed' && store.state.current !== 'initialized'
  )
})

const disarmDisabled = computed(() => {
  return (
    store.state.current === 'disarmed' || store.state.current === 'initialized'
  )
})
</script>
