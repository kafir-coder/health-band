import { query } from ".."
import { databaseConfig } from "../../config/database"

export const createAppDatabase = async () => {
   await query("CREATE DATABASE health_band")
}
