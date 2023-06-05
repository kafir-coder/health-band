import express from 'express'
import { appConfig } from './config/app'
import { mountRoutes } from './routes'
import { worker } from './mq/workers'
import cors from 'cors'

const app = express()




app.use(express.json())
app.use(cors())

mountRoutes(app)


app.listen(appConfig.port, async () => {

    await worker.run()
    console.log("listenning on port "+appConfig.port)
})
