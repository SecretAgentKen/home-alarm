import axios from 'axios'
import { KonnectedSensor } from '../types'
import { SensorEmitter } from './sensorEmitter'
import { pick, isEqual } from 'lodash'
import http from 'node:http'
import { Router } from 'express'

export function createKonnectedSensor(config: KonnectedSensor, router: Router) {
  const emitter = new SensorEmitter()

  const client = axios.create({
    baseURL: `http://${config.settings.host}:${config.settings.port}`,
    // Without this, you'll get connection reset errors
    httpAgent: new http.Agent({ keepAlive: false })
  })
  client.defaults.headers.common = {}
  // Verify settings
  client
    .get('/status')
    .then((resp) => {
      if (resp.data) {
        // Create a copy of the data
        let data = { ...resp.data }
        data.apiUrl = data.settings.apiUrl
        data.token = data.settings.token
        data = pick(data, [
          'sensors',
          'actuators',
          'dht_sensors',
          'ds18b20_sensors',
          'token',
          'apiUrl'
        ])
        data.sensors.forEach((s: { pin: number; state: number }) =>
          processRecord(s)
        )
        data.sensors.forEach((s: { state: unknown }) => {
          delete s.state
        })
        // Are the two values equal?
        if (!isEqual(data, config.settings.config)) {
          console.log('Updating settings for', config.settings.id)
          client.put('/settings', config.settings.config).catch((err) => {
            console.error(
              'Failed to update settings for',
              config.settings.id,
              err
            )
          })
        } else {
          console.log('Configuration unchanged')
        }

        router.put(`/device/${config.settings.id}`, (req, res) => {
          processRecord(req.body)
          res.send()
        })

        function processRecord(val: { pin: number; state: number }) {
          const match = config.mappings.find((rec) => rec.pin === val.pin)
          if (match) {
            emitter.emit('sensorChanged', {
              notifierKey: match.notifierKey,
              id: match.id,
              active: !!val.state
            })
          }
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })

  return emitter
}
