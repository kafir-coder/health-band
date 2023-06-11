import { query } from "../../database"
import { generateStatus, getRandomSPO } from "../../helpers/utils-fn"
import { TwilioAdapter } from "../../providers/message/twilio"
import { SensorParams } from "../../routes/sensors"
import * as crypto from 'crypto'

export const ANOMALIA_MESSAGE = "O SP02 esta fora do normal, convem consultar um posto de saúde"
export const handleSPO2 = async (data: SensorParams) => {

    const { device_id, timestamp, value } = data
    const isNormal = isSPO2Normal(data.value)

    if (!isNormal) {
        // DO SOMETHING WITH THIS INFORMATION
        await TwilioAdapter.sendMessage(ANOMALIA_MESSAGE)
    }

    const status = generateStatus(isNormal)

    const id = crypto.randomUUID()
    const { rows } = await query("SELECT id FROM users WHERE device_id=$1", [device_id])

    await query(`
        INSERT INTO sp02_entry(id, value, user_id, status, timestamp) values($1, $2, $3, $4, $5)`,
        [id, getRandomSPO(95, 100).toFixed(2), rows[0].id, status, new Date()]
    )
}

const isSPO2Normal = (spo2: number) => {
    return spo2 >= 90 && spo2 <= 100
}
