import { AlarmActor } from './stateMachine'
import { ConfigurationFile } from './types'
import Pushover from 'pushover-notifications'
import { AlarmStates } from './types'

export function initializeNotifiers(
  actor: AlarmActor,
  config: ConfigurationFile
) {
  let lastSnapshot = ''
  const pushoverNotifiers = config.notifiers
    .filter((n) => n.type === 'pushover')
    .map((notifier) => {
      const pushover = new Pushover({
        user: process.env.PUSHOVER_USER ?? '',
        token: process.env.PUSHOVER_TOKEN ?? ''
      })

      return (state: AlarmStates) => {
        if (notifier.notifyOn.includes(state))
          pushover.send({
            message: notifier.messages[state] ?? `Message Not Set For ${state}`
          })
      }
    })

  actor.subscribe((snapshot) => {
    if (lastSnapshot !== snapshot.value) {
      lastSnapshot = snapshot.value
      pushoverNotifiers.forEach((notify) => notify(snapshot.value))
    }
  })
}
