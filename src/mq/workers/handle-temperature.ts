import { query } from "../../database"
import { generateStatus } from "../../helpers/utils-fn"
import { TwilioAdapter } from "../../providers/message/twilio"
import { SensorParams } from "../../routes/sensors"
import * as crypto from 'crypto'

export const ANOMALIA_MESSAGE = "A temperatura esta fora do normal, convem consultar um posto de saúde"
export const handleTemperature = async (data: SensorParams) => {

    const { device_id, timestamp, value } = data
    const isNormal = isTemperatureNormal(data.value)

    if (!isNormal) {
        // DO SOMETHING WITH THIS INFORMATION
        await TwilioAdapter.sendMessage(ANOMALIA_MESSAGE)
    }

    const status = generateStatus(isNormal)
    const id = crypto.randomUUID()
    const { rows } = await query("SELECT id FROM users WHERE device_id=$1", [device_id])

    await query(`
        INSERT INTO temperature_entry(id, value, user_id, status, timestamp) values($1, $2, $3, $4, $5)`,
        [id, value, rows[0].id, status, new Date()]
    )
}

const isTemperatureNormal = (temperature: number) => {
    return temperature >= 36.1 && temperature <= 37.2
}
