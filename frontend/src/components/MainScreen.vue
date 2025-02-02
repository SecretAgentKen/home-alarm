<template>
  <div class="flex flex-col gap-2">
    <AccessoryBar></AccessoryBar>
    <SensorBar></SensorBar>
    <StatePanel class="flex-1"></StatePanel>
    <ActionButtonBar
      @disarm="emit('disarm')"
      @arm="emit('arm')"
    ></ActionButtonBar>
  </div>
</template>

<script setup lang="ts">
import StatePanel from '@/components/StatePanel.vue'
import ActionButtonBar from '@/components/ActionButtonBar.vue'
import AccessoryBar from '@/components/AccessoryBar.vue'
import SensorBar from '@/components/SensorBar.vue'

const emit = defineEmits<{
  (e: 'disarm'): void
  (e: 'arm'): void
}>()
</script>
