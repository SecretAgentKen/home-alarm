import fs from 'fs'
import { parse } from 'yaml'
import { ConfigurationFile, ConfigurationFileSchema } from './types'

export function loadConfig(configFilePath: string): ConfigurationFile | false {
  if (!fs.existsSync(configFilePath)) {
    console.error(
      `Configuration file ${configFilePath} does not exist. Exiting.`
    )
    return false
  }

  const fileContents = fs.readFileSync(configFilePath, 'utf-8')
  const parsedContents = parse(fileContents)
  const zodResult = ConfigurationFileSchema.safeParse(parsedContents)
  if (!zodResult.success) {
    console.error('Configuration file schema error. ', zodResult.error)
    return false
  }
  return zodResult.data
}
