import { query } from "../../database"
import { SensorParams } from "../../routes/sensors"
import * as crypto from 'crypto'

export const handlebpm = async (data: SensorParams) => {

    const { device_id, timestamp, value } = data
    const isNormal = isBpmNormal(data.value)

    if (!isNormal) {
        // DO SOMETHING WITH THIS INFORMATION
    }

    const id = crypto.randomUUID()
    const { rows } = await query("SELECT id FROM users WHERE device_id=$1", [device_id])

    await query(`
        INSERT INTO heart_beaps_entry(id, value, user_id, timestamp) values($1, $2, $3, $4)`,
        [id, value, rows[0].id, new Date()]
    )
}

const isBpmNormal = (bpm: number) => {
    return bpm >= 36.1 || bpm <= 37.2
}
