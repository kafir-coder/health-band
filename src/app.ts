import express from 'express'
import { appConfig } from './config/app'
import { mountRoutes } from './routes'
import { ok } from 'assert'
import { worker } from './mq/workers'


const app = express()




app.use(express.json())

mountRoutes(app)


app.listen(appConfig.port, async () => {

    await worker.run()
    console.log("listenning on port "+appConfig.port)
})
