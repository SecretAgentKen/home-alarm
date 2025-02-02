import { createActor, setup } from 'xstate'
import { ConfigurationFile } from './types'
import fs from 'node:fs'

export type AlarmActor = ReturnType<typeof initializeStateMachine>

export function initializeStateMachine(config: ConfigurationFile) {
  const alarmMachine = setup({
    // Config values are in seconds
    delays: {
      timerArming: () => {
        return config.server.timers.arming * 1000
      },
      timerPresentable: () => {
        return config.server.timers.presentable * 1000
      },
      timerEmergency: () => {
        return config.server.timers.emergency * 1000
      }
    }
  }).createMachine({
    initial: 'initialized',
    states: {
      // State at startup. Will transition immediately
      initialized: {
        entry: (entry) => {
          // If the alarm file exists, go to armedPresentable, otherwise disarmed
          if (fs.existsSync(config.server.stateFile)) {
            entry.self.send({ type: 'ARM' })
          } else {
            entry.self.send({ type: 'DISARM' })
          }
        },
        on: {
          DISARM: { target: 'disarmed' },
          ARM: { target: 'armedPresentable' }
        }
      },
      disarmed: {
        entry: () => updateAlarmFile(config.server.stateFile, false),
        on: {
          ARM: { target: 'arming' }
        }
      },
      arming: {
        after: {
          timerArming: {
            target: 'armedEarly'
          }
        },
        on: {
          DISARM: { target: 'disarmed' },
          CANCEL: { target: 'disarmed' }
        }
      },
      armedEarly: {
        entry: () => updateAlarmFile(config.server.stateFile, true),
        after: {
          timerPresentable: {
            target: 'armedPresentable'
          }
        },
        on: {
          DISARM: { target: 'disarmed' },
          TRIP: { target: 'tripped' }
        }
      },
      armedPresentable: {
        entry: () => updateAlarmFile(config.server.stateFile, true),
        on: {
          PRESENCE: { target: 'disarmed' },
          DISARM: { target: 'disarmed' },
          TRIP: { target: 'tripped' }
        }
      },
      tripped: {
        after: {
          timerEmergency: {
            target: 'emergency'
          }
        },
        on: {
          PRESENCE: { target: 'disarmed' },
          DISARM: { target: 'disarmed' }
        }
      },
      emergency: {
        on: {
          PRESENCE: { target: 'disarmed' },
          DISARM: { target: 'disarmed' }
        }
      }
    }
  })

  return createActor(alarmMachine)
}

function updateAlarmFile(path: string, armed: boolean) {
  try {
    if (armed) {
      fs.closeSync(fs.openSync(path, 'w'))
    } else if (fs.existsSync(path)) {
      fs.unlinkSync(path)
    }
  } catch (err) {
    console.error('Could not read/write alarm file: ', path, err)
  }
}
