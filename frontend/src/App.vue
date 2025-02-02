<template>
  <div
    class="flex min-h-screen min-w-screen flex-col bg-neutral-800 text-white"
  >
    <DisarmScreen
      v-if="
        isDisarming &&
        store.state.current !== 'disarmed' &&
        store.state.current != 'initialized'
      "
      class="flex-1"
      @cancel="isDisarming = false"
    ></DisarmScreen>
    <ArmingScreen
      v-else-if="store.state.current === 'arming'"
      class="flex-1"
    ></ArmingScreen>
    <MainScreen
      v-else
      class="flex-1"
      @disarm="isDisarming = true"
      @arm="store.arm"
    ></MainScreen>
    <div v-for="audioConfig in audioConfigEntries" :key="audioConfig.key">
      <audio
        v-if="audioConfig.notifyOn.includes(store.state.current)"
        :src="`audio/${audioConfig.audio[store.state.current]?.path}`"
        autoplay
        :loop="audioConfig.audio[store.state.current]?.loop"
      ></audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DisarmScreen from '@/components/DisarmScreen.vue'
import MainScreen from '@/components/MainScreen.vue'
import ArmingScreen from '@/components/ArmingScreen.vue'
import { useAlarmStore } from '@/services/useAlarmStore'

// If tripped and disarming - Disarm screen
// else if arming - Arming screen
// else main
const isDisarming = ref(false)

const store = useAlarmStore()

const audioConfigEntries = computed(() => {
  return store.state.config?.notifiers.filter((n) => n.type === 'audio')
})

watch(
  () => store.state.current,
  () => {
    if (store.state.current === 'disarmed') isDisarming.value = false
  }
)

store.initialize()
</script>
