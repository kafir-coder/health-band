import { query } from ".."

export const createTables = async () => {

    // user table

    /**
     * id: uuid
     * name: string
     * birth_date: date
     * device_id: string
     * phone: string
     * status: string
     * status: EXERCITANDO | DORMINDO | ACORDADO
     */
    await query(`
        create table users(
            id TEXT PRIMARY KEY,
	        name TEXT NOT NULL,
	        password TEXT NOT NULL,
	        phone TEXT UNIQUE NOT NULL,
            device_id TEXT UNIQUE NOT NULL,
            birth_date DATE NOT NULL,
            status TEXT NOT NULL,
	        created_on TIMESTAMP NOT NULL
        )
    `)
    // heart_beaps_entry table

    /**
     * id: uuid
     * value: number
     * timestamp: date
     */

    await query(`
        create table heart_beaps_entry (
            id TEXT PRIMARY KEY,
	        value real NOT NULL,
            user_id TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL
        )
    `)
    // temperature_entry table

    await query(`
        create table temperature_entry (
            id TEXT PRIMARY KEY,
	        value real NOT NULL,
            user_id TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL
        )
    `)
    // sp02_entry table

    await query(`
        create table sp02_entry (
            id TEXT PRIMARY KEY,
	        value real NOT NULL,
            user_id TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL
        )
    `)
}
