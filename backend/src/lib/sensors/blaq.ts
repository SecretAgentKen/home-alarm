import axios from 'axios'
import { BlaqSensor } from '../types'
import { SensorEmitter } from './sensorEmitter'

export function createBlaqSensor(config: BlaqSensor) {
  const emitter = new SensorEmitter()

  const client = axios.create({
    baseURL: `http://${config.settings.host}`
  })

  ;(async () => {
    while (true) {
      try {
        await doConnect()
      } catch {
        // Do nothing
      }
    }
  })()

  return emitter

  function doConnect() {
    return client
      .get('/events', {
        headers: {
          Accept: 'text/event-stream'
        },
        responseType: 'stream',
        adapter: 'fetch'
      })
      .then(async (response) => {
        const reader = response.data
          .pipeThrough(new TextDecoderStream())
          .getReader()
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const lines = (value as string).split(/\r?\n/)
          lines.forEach((line) => {
            if (line.startsWith('data: {') && line.endsWith('}')) {
              const obj = JSON.parse(line.slice(6))
              if (obj.id === 'cover-garage_door') {
                emitter.emit('sensorChanged', {
                  notifierKey: config.settings.notifierKey,
                  id: config.settings.id,
                  active: obj.state === 'OPEN'
                })
              }
            }
          })
        }
      })
  }
}
