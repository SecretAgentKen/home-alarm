import { Request, Response } from 'express'

const connections = [] as Response[]

export function sseInit(_req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  connections.push(res)

  res.write(`data: ${JSON.stringify({ topic: 'init' })}\n\n`)

  res.on('close', () => {
    const idx = connections.indexOf(res)
    if (idx >= 0) connections.splice(idx, 1)
    res.end()
  })
}

export function sseSend(topic: string, value: unknown) {
  connections.forEach((con) => {
    con.write(`data: ${JSON.stringify({ topic, value })}\n\n`)
  })
}
