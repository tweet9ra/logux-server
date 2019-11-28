import dotenv from 'dotenv'
import * as fs from 'fs'
let envFile = '.env'
const envFilePath = `.env.${process.env.NODE_ENV}`
if (fs.existsSync(envFilePath)) {
  envFile = envFilePath
}
const buf = fs.readFileSync(envFile)
const envConfig = dotenv.parse(buf)
for (const k in envConfig) {
  if (envConfig.hasOwnProperty(k)) {
    process.env[k] = envConfig[k]
  }
}

import { Server } from '@logux/server'
import jwt from 'jwt-simple'

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname,
    port: process.env.LOGUX_PORT || null,
    controlPort: process.env.LOGUX_PORT ? +process.env.LOGUX_PORT + 1 : null
  })
)

if (+ process.env.JWT_ENABLED) {
  server.auth(async (userId: string | false, token: string): Promise<boolean> => {
    if (userId === false) {
      return true
    }

    try {
      // @ts-ignore
      const data = jwt.decode(token, process.env.JWT_SECRET)
      return data.sub === +userId
    } catch (e) {
      console.error('Failed to decode')
      return false
    }
  })
}

server.listen()
