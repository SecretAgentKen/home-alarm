import { loadConfig } from './lib/config'
import { initializeManager } from './lib/manager'
import { createAlarmServer } from './lib/http/server'
import { initializeStateMachine } from './lib/stateMachine'
import { initializeNotifiers } from './lib/notifiers'

console.log('Starting home-alarm...')

console.log('Loading configuration from CONFIG_FILE...')
const config = loadConfig(process.env.CONFIG_FILE ?? 'sample.yaml')
if (!config) process.exit(-1)

console.log('Loading pin...')
const pin = process.env.ALARM_PIN ?? ''
if (!pin.match(/^\d+$/)) {
  console.error(
    'No alarm pin specified or bad format for ALARM_PIN. Must be a string of 0-9'
  )
  process.exit(-1)
}

console.log('Loading state machine...')
const alarmActor = initializeStateMachine(config)

initializeNotifiers(alarmActor, config)

const { emitter, router } = initializeManager(alarmActor, config)

console.log('Creating server...')
createAlarmServer(alarmActor, emitter, router, config)

alarmActor.start()
console.log('Startup complete')
