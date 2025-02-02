import EventEmitter from 'node:events'
import { SensorEvents } from '../types'

export class SensorEmitter extends EventEmitter {
  emit<T extends keyof SensorEvents>(
    event: T,
    ...args: [SensorEvents[T]]
  ): boolean {
    return super.emit(event, ...args)
  }

  on<T extends keyof SensorEvents>(
    event: T,
    listener: (...args: [SensorEvents[T]]) => void
  ): this {
    return super.on(event, listener)
  }
}
