<template>
  <div class="flex flex-col p-2">
    <div class="flex flex-1 flex-row items-center justify-center">
      <span class="text-4xl">Arming in {{ countdown }} seconds...</span>
    </div>
    <button class="btn btn-big bg-neutral-950" @click="store.cancel()">
      Cancel
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const store = useAlarmStore()
let timer: number | null

let countdown = ref(0)

onMounted(() => {
  countdown.value = store.state.config?.server.timers.arming ?? 0
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer !== null) clearInterval(timer)
      timer = null
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer !== null) clearInterval(timer)
  timer = null
})
</script>
