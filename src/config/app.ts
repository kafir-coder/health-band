import {config} from 'dotenv'

config()

export const appConfig = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
}
