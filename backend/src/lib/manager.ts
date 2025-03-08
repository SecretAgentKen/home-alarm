import { createPingSensor } from './sensors/ping'
import { ConfigurationFile } from './types'
import { createKonnectedSensor } from './sensors/konnected'
import { Router } from 'express'
import { CollectorEmitter } from './collectorEmitter'
import { AlarmActor } from './stateMachine'
import { createBlaqSensor } from './sensors/blaq'

const state: Record<string, string[]> = {}
const emitter = new CollectorEmitter()

export function initializeManager(
  actor: AlarmActor,
  config: ConfigurationFile
) {
  const router = Router()
  // Setup collector state
  config.collectors.forEach((c) => {
    state[c.key] = []
  })

  config.sensors.forEach((sensor) => {
    if (sensor.type === 'ping') {
      const pinEmitter = createPingSensor(sensor)
      pinEmitter.on('sensorChanged', updateState)
    } else if (sensor.type === 'konnected') {
      const konnectedEmitter = createKonnectedSensor(sensor, router)
      konnectedEmitter.on('sensorChanged', updateState)
    } else if (sensor.type === 'blaq') {
      const blaqEmitter = createBlaqSensor(sensor)
      blaqEmitter.on('sensorChanged', updateState)
    }
  })

  emitter.on(
    'collectorChanged',
    (ev: { notifierKey: string; ids: string[] }) => {
      // Fire off triggers
      config.collectors.forEach((c) => {
        if (c.trigger && ev.notifierKey === c.key && ev.ids.length) {
          actor.send({ type: c.trigger })
        }
      })
    }
  )

  return { emitter, router }
}

export function getState() {
  return state
}

function updateState(ev: { notifierKey: string; id: string; active: boolean }) {
  if (!state[ev.notifierKey]) state[ev.notifierKey] = []
  state[ev.notifierKey] = state[ev.notifierKey].filter((v) => v !== ev.id)
  if (ev.active) state[ev.notifierKey].push(ev.id)
  emitter.emit('collectorChanged', {
    notifierKey: ev.notifierKey,
    ids: state[ev.notifierKey]
  })
}
