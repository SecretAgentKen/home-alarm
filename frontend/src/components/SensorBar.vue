<template>
  <div class="flex flex-row justify-around bg-neutral-700 p-4 text-4xl">
    <CollectorIcon
      v-for="collector in collectors"
      :key="collector.key"
      :collector="collector"
    ></CollectorIcon>
  </div>
</template>

<script setup lang="ts">
import CollectorIcon from '@/components/CollectorIcon.vue'
import { useAlarmStore } from '@/services/useAlarmStore'
import { computed } from 'vue'

const store = useAlarmStore()

const collectors = computed(() => {
  return store.state.config?.collectors.filter((c) => c.icon) ?? []
})
</script>
