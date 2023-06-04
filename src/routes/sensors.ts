import { created } from "../helpers/http-helpers"
import { query } from "../database"
import * as crypto from 'crypto'
import { Router, Request, Response } from 'express'
import { myQueue } from "../mq"

const router = Router()
export interface SensorParams {
    value: number
    timestamp: Date
    device_id: string
}

export const writeTemperature = async (payload: SensorParams) => myQueue.add('temperature', payload)

export const writeHeartBpm = async (payload: SensorParams) => myQueue.add('heart_bpm', payload)

export const writeSPO2 = async (payload: SensorParams) => myQueue.add('spo2', payload)




router.post('/sensors/write-temperature', async (req: Request, res: Response) => {
    await writeTemperature(req.body)
    res.status(200).json(created('ok'))
})

router.post('/sensors/write-heartbpm', async (req: Request, res: Response) => {
    await writeHeartBpm(req.body)
    res.status(200).json(created('ok'))
})

router.post('/sensors/write-spo2', async (req: Request, res: Response) => {
    await writeSPO2(req.body)
    res.status(200).json(created('ok'))
})



export const sensorsRouter = router
