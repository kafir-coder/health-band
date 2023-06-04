import { created, notFound, ok } from "../helpers/http-helpers"
import { query } from "../database"
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'
import { Router, Request, Response } from 'express'

const router = Router()
export interface UserParams {
    name: string
    birth_date: Date
    device_id: string
    phone: string
    password: string,
    status: 'EXERCITANDO' | 'DORMINDO' | 'ACORDADO'
}
export const createUsers = async (payload: UserParams) => {

    const { birth_date, device_id, name, phone, status, password } = payload
    const id = crypto.randomUUID()
    const pwd = bcrypt.hash(password, 20)

    // try-catch errors
    await query(`
        INSERT INTO users(id, name, password, phone, device_id, birth_date, status, created_on) values($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, name, pwd, phone, device_id, birth_date, status, new Date()]
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
        "SELECT count(*) FROM users"
    )

    const { rows, rowCount} = await query(
        "SELECT * FROM users ORDER BY id DESC LIMIT $1 OFFSET $2",
        [limit, (page-1)*limit]
    )

    return {
        data: rows,
        count: result.rows
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
