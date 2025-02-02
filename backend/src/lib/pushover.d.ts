declare module 'pushover-notifications' {
  export default class Pushover {
    constructor(options: { user: string; token: string })
    send(options: { message: string }): void
  }
}
