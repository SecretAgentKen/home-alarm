<template>
  <FAIcon :icon="currentSetting.icon" :style="currentSetting.style"></FAIcon>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import type { Collector } from '@backend/lib/types'
import { computed } from 'vue'

const props = defineProps<{
  collector: Collector
}>()

const store = useAlarmStore()

const currentSetting = computed(() => {
  if (store.state.activeSensors.includes(props.collector.key)) {
    return props.collector.icon!.active
  } else return props.collector.icon!.inactive
})
</script>
