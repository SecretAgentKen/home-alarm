import { reactive, readonly } from 'vue'
import type { AlarmStates, ConfigurationFile } from '@backend/lib/types'
import axios from 'axios'

const state = reactive<{
  current: AlarmStates
  activeSensors: string[]
  sensorMap: Record<string, string[]>
  config: ConfigurationFile | undefined
  isOffline: boolean
}>({
  current: 'disarmed',
  activeSensors: [],
  sensorMap: {},
  config: undefined,
  isOffline: true
})

type EventData = { topic: string; value: unknown }
type CollectorEventData = {
  topic: string
  value: { notifierKey: string; ids: string[] }
}
type AlarmEventData = { topic: string; value: AlarmStates }
let evtsrc: undefined | EventSource

export function useAlarmStore() {
  return {
    state: readonly(state),
    arm,
    disarm,
    cancel,
    initialize,
    actuate
  }
}

function isStateEventData(ev: EventData): ev is AlarmEventData {
  return ev.topic === 'state'
}

function isCollectorEventData(ev: EventData): ev is CollectorEventData {
  return ev.topic === 'collector'
}

function initialize() {
  axios.get('/api/state').then((res) => {
    state.current = res.data.state as AlarmStates
    state.activeSensors = res.data.activeSensors
    state.sensorMap = res.data.sensorMap
  })

  axios.get('/api/config').then((res) => {
    state.config = res.data as ConfigurationFile
  })

  if (!evtsrc) {
    evtsrc = new EventSource('/api/stream')
    evtsrc.onmessage = function (evt) {
      const data = JSON.parse(evt.data) as EventData
      if (isStateEventData(data)) state.current = data.value
      if (isCollectorEventData(data)) {
        state.activeSensors = state.activeSensors.filter(
          (v) => v !== data.value.notifierKey
        )
        state.sensorMap[data.value.notifierKey] = data.value.ids
        if (data.value.ids.length)
          state.activeSensors.push(data.value.notifierKey)
      }
    }
    evtsrc.onerror = () => {
      state.isOffline = true
      evtsrc?.close()
      evtsrc = undefined
      setTimeout(initialize, 1000)
    }
    evtsrc.onopen = () => {
      state.isOffline = false
    }
  }
}

function arm() {
  return axios.post('/api/arm')
}

function cancel() {
  return axios.post('/api/cancel')
}

function disarm(pin: string) {
  return axios.post('/api/disarm', { pin })
}

function actuate(key: string) {
  return axios.post('/api/actuate', { key })
}
