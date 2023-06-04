import { query } from "../../database"
import { SensorParams } from "../../routes/sensors"
import * as crypto from 'crypto'

export const handleSPO2 = async (data: SensorParams) => {

    const { device_id, timestamp, value } = data
    const isNormal = isSPO2Normal(data.value)

    if (!isNormal) {
        // DO SOMETHING WITH THIS INFORMATION
    }

    const id = crypto.randomUUID()
    const { rows } = await query("SELECT id FROM users WHERE device_id=$1", [device_id])

    await query(`
        INSERT INTO sp02_entry(id, value, user_id, timestamp) values($1, $2, $3, $4)`,
        [id, value, rows[0].id, new Date()]
    )
}

const isSPO2Normal = (spo2: number) => {
    return spo2 >= 36.1 || spo2 <= 37.2
}
