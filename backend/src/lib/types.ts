import { z } from 'zod'

/**
 * Criteria for status from sensors
 * ALARM - If active, trip the alarm
 * DISARM - If active, disarm the alarm
 */
export type AlertCriteria = 'ALARM' | 'DISARM'

const AlarmStateSchema = z.enum([
  'initialized',
  'disarmed',
  'arming',
  'armedEarly',
  'armedPresentable',
  'tripped',
  'emergency'
])
export type AlarmStates = z.infer<typeof AlarmStateSchema>

const StateEventSchema = z.enum(['ARM', 'DISARM', 'CANCEL', 'TRIP', 'PRESENCE'])

export type StateEvent = z.infer<typeof StateEventSchema>

export type SensorEvents = {
  sensorChanged: { notifierKey: string; id: string; active: boolean }
}

export type CollectorEvents = {
  collectorChanged: { notifierKey: string; ids: string[] }
}

const SensorSchema = z.object({
  type: z.string()
})

const KonnectedMappingSchema = z.array(
  z.object({
    pin: z.number(),
    notifierKey: z.string(),
    id: z.string()
  })
)
export type KonnectedMapping = z.infer<typeof KonnectedMappingSchema>

const KonnectedSensorSchema = SensorSchema.extend({
  type: z.literal('konnected'),
  settings: z.object({
    host: z.string(),
    port: z.number(),
    id: z.string(),
    config: z.object({
      sensors: z.array(
        z.object({
          pin: z.number()
        })
      ),
      actuators: z.array(z.string()),
      dht_sensors: z.array(z.string()),
      ds18b20_sensors: z.array(z.string()),
      token: z.string(),
      apiUrl: z.string()
    })
  }),
  mappings: KonnectedMappingSchema
})
export type KonnectedSensor = z.infer<typeof KonnectedSensorSchema>

const PingSensorSchema = SensorSchema.extend({
  type: z.literal('ping'),
  settings: z.object({
    host: z.string(),
    notifierKey: z.string(),
    id: z.string()
  })
})
export type PingSensor = z.infer<typeof PingSensorSchema>

const CollectorSchema = z.object({
  key: z.string(),
  allowArm: z.boolean(),
  trigger: StateEventSchema.optional(),
  icon: z
    .object({
      inactive: z.object({
        icon: z.string(),
        style: z
          .record(z.string(), z.union([z.string(), z.number()]))
          .optional()
      }),
      active: z.object({
        icon: z.string(),
        style: z
          .record(z.string(), z.union([z.string(), z.number()]))
          .optional()
      })
    })
    .optional()
})
export type Collector = z.infer<typeof CollectorSchema>

const NotifierSchema = z.object({
  key: z.string(),
  type: z.string(),
  notifyOn: z.array(AlarmStateSchema)
})

const PushoverNotifierSchema = NotifierSchema.extend({
  type: z.literal('pushover'),
  messages: z.record(AlarmStateSchema, z.string())
})
export type PushoverNotifier = z.infer<typeof PushoverNotifierSchema>

const AudioNotifierSchema = NotifierSchema.extend({
  type: z.literal('audio'),
  audio: z.record(
    AlarmStateSchema,
    z.object({
      path: z.string(),
      loop: z.boolean().optional()
    })
  )
})
export type AudioNotifier = z.infer<typeof AudioNotifierSchema>

/**
 * Configuration File
 */
export const ConfigurationFileSchema = z.object({
  server: z.object({
    timers: z.object({
      arming: z.number(),
      presentable: z.number(),
      emergency: z.number()
    }),
    stateFile: z.string()
  }),
  sensors: z.array(z.union([KonnectedSensorSchema, PingSensorSchema])),
  collectors: z.array(CollectorSchema),
  notifiers: z.array(z.union([AudioNotifierSchema, PushoverNotifierSchema]))
})

export type ConfigurationFile = z.infer<typeof ConfigurationFileSchema>
