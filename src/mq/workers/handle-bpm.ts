import { query } from "../../database"
import { generateStatus, getRandomBPM } from "../../helpers/utils-fn"
import { TwilioAdapter } from "../../providers/message/twilio"
import { SensorParams } from "../../routes/sensors"
import * as crypto from 'crypto'

export const ANOMALIA_MESSAGE = "Os batimentos cardiaco estão fora do normal, convem consultar um posto de saúde"
export const handlebpm = async (data: SensorParams) => {


    const sensorValue = parseInt(getRandomBPM(60, 100).toFixed(2))
    const { device_id, timestamp, value } = data
    const isNormal = isBpmNormal(sensorValue)

    if (!isNormal) {
        // DO SOMETHING WITH THIS INFORMATION
        await TwilioAdapter.sendMessage(ANOMALIA_MESSAGE)
    }

    const status = generateStatus(isNormal)
    const id = crypto.randomUUID()
    const { rows } = await query("SELECT id FROM users WHERE device_id=$1", [device_id])

    await query(`
        INSERT INTO heart_beaps_entry(id, value, user_id, status, timestamp) values($1, $2, $3, $4, $5)`,
        [id, sensorValue, rows[0].id, status, new Date()]
    )
}

const isBpmNormal = (bpm: number) => {
    return bpm >= 40 && bpm <= 150
}

