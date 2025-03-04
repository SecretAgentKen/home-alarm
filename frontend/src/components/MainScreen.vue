<template>
  <div class="flex flex-col gap-2">
    <AccessoryBar></AccessoryBar>
    <SensorBar></SensorBar>
    <StatePanel class="flex-1"></StatePanel>
    <ActionButtonBar @disarm="emit('disarm')" @arm="arm"></ActionButtonBar>
    <dialog
      ref="preventArmDialog"
      class="h-dvh max-h-none w-dvw max-w-none bg-transparent text-white backdrop-blur-md"
    >
      <div class="flex h-full flex-row items-center justify-center">
        <div
          class="flex h-2/3 w-2/3 flex-col overflow-hidden rounded-lg border-2 border-dashed border-yellow-600 bg-neutral-800"
        >
          <div class="flex flex-row-reverse bg-neutral-900">
            <form method="dialog">
              <button class="btn m-2 h-8 w-8 border-2 text-lg text-current/50">
                <FAIcon icon="xmark" size="lg"></FAIcon>
              </button>
            </form>
          </div>
          <div class="flex-1 p-4 text-lg">
            Cannot arm due to the following sensors:
            <ul class="ml-8 list-disc">
              <li v-for="s in sensors" :key="s">{{ s }}</li>
            </ul>
          </div>
          <form method="dialog" class="flex flex-col">
            <button class="btn m-2 bg-neutral-950 p-2 text-lg font-bold">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import StatePanel from '@/components/StatePanel.vue'
import ActionButtonBar from '@/components/ActionButtonBar.vue'
import AccessoryBar from '@/components/AccessoryBar.vue'
import SensorBar from '@/components/SensorBar.vue'
import { computed, useTemplateRef } from 'vue'
import { useAlarmStore } from '@/services/useAlarmStore'

const emit = defineEmits<{
  (e: 'disarm'): void
  (e: 'arm'): void
}>()

const preventArmDialog = useTemplateRef('preventArmDialog')

const alarmStore = useAlarmStore()

const sensors = computed(() => {
  return Object.keys(alarmStore.state.sensorMap)
    .filter((key) => {
      const config = alarmStore.state.config?.collectors.find(
        (c) => c.key === key
      )
      // We only care if allowArm is false and we have a config
      return config && !config.allowArm
      // We now have the keys that would prevent arming, see if anything is set
    })
    .filter((key) => alarmStore.state.sensorMap[key]?.length)
    .flatMap((key) => {
      return alarmStore.state.sensorMap[key].map((id) => `${key} - ${id}`)
    })
})

function arm() {
  if (sensors.value.length) preventArmDialog.value?.showModal()
  else emit('arm')
}
</script>
