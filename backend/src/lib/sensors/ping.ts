import { exec } from 'node:child_process'
import { PingSensor } from '../types'
import { SensorEmitter } from './sensorEmitter'
const PING = 'ping -c 1 -W 2 '

export function createPingSensor(config: PingSensor) {
  const emitter = new SensorEmitter()

  setTimeout(checkHost, 1000)
  setInterval(checkHost, 30000)

  return emitter

  function checkHost() {
    exec(PING + config.settings.host, function (err) {
      emitter.emit('sensorChanged', {
        notifierKey: config.settings.notifierKey,
        id: config.settings.id,
        active: !err
      })
    })
  }
}
