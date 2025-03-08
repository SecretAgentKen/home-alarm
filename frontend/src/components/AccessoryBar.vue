<template>
  <div class="mx-2 mt-2 flex flex-row justify-between">
    <div class="flex flex-row gap-2">
      <button
        v-for="actuator in alarmStore.state.config?.actuators"
        :key="actuator.key"
        :disabled="disabled"
        class="btn flex items-center gap-2 bg-stone-600"
        @click="toggle(actuator.key)"
      >
        <FAIcon v-if="disabled" icon="spinner" class="animate-spin"></FAIcon
        >{{ actuator.key }}
      </button>
    </div>
    <button
      class="h-12 w-12 rounded border-2 border-current/50 p-2 text-2xl text-current/50"
      @click="reload"
    >
      <FAIcon icon="refresh"></FAIcon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import { onUnmounted, ref } from 'vue'

const alarmStore = useAlarmStore()
const disabled = ref(false)
let timer: number | undefined

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function toggle(key: string) {
  disabled.value = true
  timer = setTimeout(() => {
    disabled.value = false
  }, 10000)
  alarmStore.actuate(key)
}

function reload() {
  window.location.reload()
}
</script>
