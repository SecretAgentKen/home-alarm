<template>
  <div class="flex flex-col">
    <div
      class="mt-4 flex flex-row items-center justify-between bg-neutral-700 p-4"
    >
      <FAIcon
        v-if="hasError"
        icon="triangle-exclamation"
        class="animate-pulse text-yellow-600"
        size="xl"
      ></FAIcon>
      <div class="flex flex-1 flex-row items-center justify-center gap-2">
        <span>&nbsp;</span>
        <FAIcon
          v-for="i in new Array(pin.length).keys()"
          :key="i"
          icon="circle"
        ></FAIcon>
        <span>&nbsp;</span>
      </div>
      <FAIcon
        v-if="hasError"
        icon="triangle-exclamation"
        class="animate-pulse text-yellow-600"
        size="xl"
      ></FAIcon>
    </div>
    <div class="flex flex-1 flex-row gap-12 p-4">
      <div class="grid flex-1 grid-cols-3 gap-4">
        <button
          v-for="i in [...Array(9).keys()]"
          :key="i"
          class="btn btn-big bg-neutral-950"
          :disabled="checking"
          @click="pin.push(`${i + 1}`)"
        >
          {{ i + 1 }}
        </button>
        <button
          class="btn btn-big col-start-2 bg-neutral-950"
          :disabled="checking"
          @click="pin.push('0')"
        >
          0
        </button>
      </div>
      <div class="flex min-w-32 flex-col gap-12">
        <button
          class="btn btn-big bg-neutral-950"
          :disabled="checking"
          @click="backOrCancel"
        >
          <FAIcon v-if="pin.length" icon="delete-left"></FAIcon>
          <span v-else>Cancel</span>
        </button>
        <button
          class="btn btn-big bg-neutral-950"
          :disabled="!pin.length || checking"
          @click="clear"
        >
          Clear
        </button>
        <button
          class="btn btn-big bg-green-700"
          :disabled="!pin.length || checking"
          @click="confirm"
        >
          <FAIcon v-if="checking" icon="spinner" class="animate-spin"></FAIcon>
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlarmStore } from '@/services/useAlarmStore'
import { ref } from 'vue'
const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const pin = ref<string[]>([])
const checking = ref<boolean>(false)
const hasError = ref<boolean>(false)

const store = useAlarmStore()

function confirm() {
  hasError.value = false
  checking.value = true
  store
    .disarm(pin.value.join(''))
    .then(() => {
      // If successful our screen will go away automatically
    })
    .catch(() => {
      hasError.value = true
    })
    .finally(() => {
      checking.value = false
    })
}

function clear() {
  pin.value.length = 0
  hasError.value = false
}

function backOrCancel() {
  hasError.value = false
  if (pin.value.length) {
    pin.value.pop()
  } else {
    emit('cancel')
  }
}
</script>
