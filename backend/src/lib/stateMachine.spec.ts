// import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'
// import { AlarmActor, initializeStateMachine } from './stateMachine'
// import tmp from 'tmp'
// import { existsSync, unlinkSync } from 'node:fs'

// tmp.setGracefulCleanup()

// describe('State Machine', async () => {
//   let actor: AlarmActor | undefined
//   let tmpFile: string | undefined

//   beforeEach(() => {
//     tmpFile = tmp.tmpNameSync()
//     vi.useFakeTimers()
//     actor = initializeStateMachine({
//       server: {
//         timers: {
//           arming: 0,
//           presentable: 0,
//           emergency: 0
//         },
//         stateFile: tmpFile
//       },
//       sensors: [],
//       collectors: [],
//       notifiers: []
//     })
//     actor.start()
//   })

//   afterEach(() => {
//     actor?.stop()
//     if (tmpFile && existsSync(tmpFile)) unlinkSync(tmpFile)
//     vi.restoreAllMocks()
//   })

//   test('Should start with disarmed if no file', async () => {
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//   })

//   test('Should transition between arming states', () => {
//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//   })

//   test('Should allow cancel ONLY for arming', () => {
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//     actor?.send({ type: 'TRIP' })
//     expect(actor?.getSnapshot().value).toBe('tripped')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('tripped')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('emergency')
//     actor?.send({ type: 'CANCEL' })
//     expect(actor?.getSnapshot().value).toBe('emergency')
//   })

//   test('Should allow disarm almost always', () => {
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     actor?.send({ type: 'TRIP' })
//     expect(actor?.getSnapshot().value).toBe('tripped')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     actor?.send({ type: 'TRIP' })
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('emergency')
//     actor?.send({ type: 'DISARM' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//   })

//   test('Should allow presence only once presentable', () => {
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('arming')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('armedEarly')
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('armedPresentable')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     vi.advanceTimersToNextTimer()
//     actor?.send({ type: 'TRIP' })
//     expect(actor?.getSnapshot().value).toBe('tripped')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')

//     actor?.send({ type: 'ARM' })
//     vi.advanceTimersToNextTimer()
//     actor?.send({ type: 'TRIP' })
//     vi.advanceTimersToNextTimer()
//     expect(actor?.getSnapshot().value).toBe('emergency')
//     actor?.send({ type: 'PRESENCE' })
//     expect(actor?.getSnapshot().value).toBe('disarmed')
//   })
// })
