import express from 'express'
import { appConfig } from './config/app'
import { mountRoutes } from './routes'
import { worker } from './mq/workers'
import cors from 'cors'
import { TwilioAdapter } from './providers/message/twilio'

const app = express()




app.use(express.json())
app.use(cors())

mountRoutes(app)


app.listen(appConfig.port, async () => {
    TwilioAdapter.init()
    await worker.run()
    console.log("listenning on port "+process.env.PORT)
})
