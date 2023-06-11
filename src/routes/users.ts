import { created, notFound, ok } from "../helpers/http-helpers"
import { query } from "../database"
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'
import { Router, Request, Response } from 'express'
import { hasToken } from "../middlewares"

const router = Router()
export interface UserParams {
    name: string
    role: string
    birth_date: Date
    device_id: string
    phone: string
    password: string,
    status: 'EXERCITANDO' | 'DORMINDO' | 'ACORDADO'
}
export const createUsers = async (payload: UserParams) => {

    const { birth_date, device_id, name, phone, status, password, role } = payload
    const id = crypto.randomUUID()
    const pwd = await bcrypt.hash(password, 10)

    // try-catch errors
    await query(`
        INSERT INTO users(id, name, password, phone, device_id, birth_date, status, role, created_on) values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, name, pwd, phone, device_id, birth_date, "ACORDADO", role, new Date()]
    )

}

export const getUser = async (id: string): Promise<UserParams> => {
    const {rows} = await query(
        "SELECT * FROM users where id=$1",
        [id]
    )
    return rows[0] as UserParams
}


export const listUsers = async (limit: number, page: number) => {

    const result = await query(
        "SELECT count(*) FROM users WHERE role=$1 ",
        ["normal"]
    )

    const { rows, rowCount} = await query(
        "SELECT * FROM users WHERE role=$1 ORDER BY id DESC LIMIT $2 OFFSET $3",
        ["normal", limit, (page-1)*limit]
    )

    return {
        data: rows,
        count: Number(result.rows[0].count)
    }
}

router.get('/', (req: Request, res: Response) => {
    res.status(200).json("servidor em cima")
})
router.post('/users', async (req: Request, res: Response) => {
    await createUsers(req.body)
    res.status(201).json(created('usuário criado com sucesso'))
})
router.get('/users', async(req: Request, res: Response) => {
    let { limit, page } = req.query as unknown as {limit: number, page: number}
    limit |= 5;
    page |= 1
    const result = await listUsers(limit as unknown as number, page as unknown as number)

    res.status(200).json(ok(result))

})

router.get('/users/:id', async(req: Request, res: Response) => {
    let { id } = req.params
    const result = await getUser(id)

    if (!result) {
        return res.status(404).json(notFound())
    }
    res.status(200).json(ok(result))
})

export const userRouter = router
