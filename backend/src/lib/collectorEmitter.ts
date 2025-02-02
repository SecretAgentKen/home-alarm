import EventEmitter from 'node:events'
import { CollectorEvents } from './types'

export class CollectorEmitter extends EventEmitter {
  emit<T extends keyof CollectorEvents>(
    event: T,
    ...args: [CollectorEvents[T]]
  ): boolean {
    return super.emit(event, ...args)
  }

  on<T extends keyof CollectorEvents>(
    event: T,
    listener: (...args: [CollectorEvents[T]]) => void
  ): this {
    return super.on(event, listener)
  }
}
