import {config} from 'dotenv'

config()


export const databaseConfig = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    name: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
}
