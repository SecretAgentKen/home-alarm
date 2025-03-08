import axios from 'axios'
import { BlaqActuator } from '../types'

export function actuateBlaq(config: BlaqActuator) {
  const client = axios.create({
    baseURL: `http://${config.settings.host}`
  })

  client.post('/cover/garage_door/toggle')
}
