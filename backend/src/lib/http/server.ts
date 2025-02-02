import express, { Router } from 'express'
import type { Request, Response } from 'express'
import { sseInit, sseSend } from './sse'
import bodyParser from 'body-parser'
import path from 'node:path'
import https from 'node:https'
import fs from 'node:fs'
import { ConfigurationFile } from '../types'
import { AlarmActor } from '../stateMachine'
import helmet from 'helmet'
import { CollectorEmitter } from '../collectorEmitter'

export function createAlarmServer(
  actor: AlarmActor,
  collector: CollectorEmitter,
  konnectedRouter: Router,
  config: ConfigurationFile
) {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, '..', '..', 'public')))
  app.get('/api/stream', sseInit)
  app.get('/api/state', getState)
  app.get('/api/config', getConfig)
  app.post('/api/arm', arm)
  app.post('/api/disarm', disarm)
  app.post('/api/cancel', cancelArm)
  app.use('/api/konnected', konnectedRouter)

  let lastSnapshot = ''
  actor.subscribe((snapshot) => {
    if (lastSnapshot !== snapshot.value) {
      lastSnapshot = snapshot.value
      console.log('State Change:', snapshot.value)
      sseSend('state', snapshot.value)
    }
  })

  collector.on(
    'collectorChanged',
    (ev: { notifierKey: string; ids: string[] }) => {
      console.log('collector', ev)
      sseSend('collector', ev)
    }
  )

  https
    .createServer(
      {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
      },
      app
    )
    .listen(8000, () => {
      console.log('Express server started')
    })

  function getState(_req: Request, res: Response) {
    res.send({
      state: actor.getSnapshot().value,
      activeSensors: [] // FIXME
    })
  }

  function arm(_req: Request, res: Response) {
    actor.send({ type: 'ARM' })
    res.send()
  }

  function cancelArm(_req: Request, res: Response) {
    actor.send({ type: 'CANCEL' })
    res.send()
  }

  function disarm(req: Request, res: Response) {
    if (req.body.pin !== process.env.ALARM_PIN) res.status(403).send()
    else {
      actor.send({ type: 'DISARM' })
      res.send()
    }
  }

  function getConfig(_req: Request, res: Response) {
    res.send(config)
  }
}
