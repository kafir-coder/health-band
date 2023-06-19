import { created, ok } from "../helpers/http-helpers"
import { Router, Request, Response } from 'express'
import { myQueue } from "../mq"
import {query} from '../database'
import { hasToken } from "../middlewares"
const router = Router()
export interface SensorParams {
    value: number
    timestamp: Date
    device_id: string
}

export const writeTemperature = async (payload: SensorParams) => myQueue.add('temperature', payload)

export const writeHeartBpm = async (payload: SensorParams) => myQueue.add('heart_bpm', payload)

export const writeSPO2 = async (payload: SensorParams) => myQueue.add('spo2', payload)

export const getTemperature = async (userId: string) => {
    const {rows} = await query(`
        SELECT
            value,
            status
        FROM temperature_entry where
            user_id=$1
        ORDER BY timestamp DESC LIMIT 1`,
        [userId]
    )

    if (rows.length === 0) {
        return "NO_DATA"
    }

    return {
        value: rows[0].value,
        status: rows[0].status
    }
}

export const getHeartBpm = async (userId: string) => {
    const {rows} = await query(`
        SELECT value, status FROM heart_beaps_entry where user_id=$1 ORDER BY timestamp DESC LIMIT 1`,
        [userId]
    )

    if (rows.length === 0) {
        return "NO_DATA"
    }
    return {
        value: rows[0].value,
        status: rows[0].status
    }
}

export const getSP02 = async (userId: string) => {
    const {rows} = await query(`
        SELECT value, status FROM sp02_entry where user_id=$1 ORDER BY timestamp DESC LIMIT 1`,
        [userId]
    )

    if (rows.length === 0) {
        return "NO_DATA"
    }

    return {
        value: rows[0].value,
        status: rows[0].status
    }
}

export const getHistoryTemperature = async (user_id: string, limit: number, page: number) => {
    const {rows} = await query(
        "SELECT * FROM temperature_entry WHERE user_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3",
        [user_id, limit, (page-1)*limit]
    )

    return rows
}

export const getHistorySP02 = async (user_id: string, limit: number, page: number) => {
    const {rows} = await query(
        "SELECT * FROM sp02_entry WHERE user_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3",
        [user_id, limit, (page-1)*limit]
    )

    return rows
}

export const getHistoryBPM = async (user_id: string, limit: number, page: number) => {

    const {rows} = await query(
        "SELECT * FROM heart_beaps_entry WHERE user_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3",
        [user_id, limit, (page-1)*limit]
    )

    return rows

}


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


router.get('/sensors/get-all-sensors-data', hasToken, async (req: Request, res: Response) => {

    //@ts-ignore
    const {userId} = req.user

    const temperature = await getTemperature(userId)
    const heartBpm = await getHeartBpm(userId)
    const sp02 = await getSP02(userId)

    return res.status(200).json({
        temperature,
        heartBpm,
        sp02
    })
})

router.get('/sensors/get-all-temperature', hasToken, async (req: Request, res: Response) => {

    //@ts-ignore
    const {userId} = req.user

    const temperature = await getTemperature(userId)

    return res.status(200).json({
        temperature,
    })
})

router.get('/sensors/get-heart-bpm', hasToken, async (req: Request, res: Response) => {

    //@ts-ignore
    const {userId} = req.user
    const heartBpm = await getHeartBpm(userId)

    return res.status(200).json({
        heartBpm,
    })
})

router.get('/sensors/get-sp02', hasToken, async (req: Request, res: Response) => {

    //@ts-ignore
    const {userId} = req.user

    const sp02 = await getSP02(userId)

    return res.status(200).json({
        sp02
    })
})

router.get('/sensors/get-spo2-history', hasToken, async (req: Request, res: Response) => {

    let { limit, page } = req.query as unknown as {limit: number, page: number}
    limit |= 20;
    page |= 1

    //@ts-ignore
    const result = await getHistorySP02(req.user.userId, limit, page)

    res.status(200).json(ok(result))

})

router.get('/sensors/get-temperature-history', hasToken, async (req: Request, res: Response) => {

    let { limit, page } = req.query as unknown as {limit: number, page: number}
    limit |= 20;
    page |= 1

    //@ts-ignore
    const result = await getHistoryTemperature(req.user.userId, limit, page)

    res.status(200).json(ok(result))
})

router.get('/sensors/get-bpm-history', hasToken, async (req: Request, res: Response) => {

    let { limit, page } = req.query as unknown as {limit: number, page: number}
    limit |= 20;
    page |= 1

    //@ts-ignore
    const result = await getHistoryBPM(req.user.userId, limit, page)

    res.status(200).json(ok(result))
})

export const sensorsRouter = router
