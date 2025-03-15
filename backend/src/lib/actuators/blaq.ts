import axios from 'axios'
import { BlaqActuator } from '../types'

export function actuateBlaq(config: BlaqActuator) {
  const client = axios.create({
    baseURL: `http://${config.settings.host}`,
    auth: {
      username: process.env.BLAQ_USER!,
      password: process.env.BLAQ_PASSWORD!
    }
  })

  client.post('/cover/garage_door/toggle')
}
