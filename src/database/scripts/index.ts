import { createAppDatabase } from "./create-database"
import { createTables } from "./create-tables"

[createAppDatabase, createTables].map(async (fn: Function) => {
    await fn()
})
