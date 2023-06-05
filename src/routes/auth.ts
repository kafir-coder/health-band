import { ok, unauthorized } from "../helpers/http-helpers"
import { query } from "../database"
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'
import { Router, Request, Response } from 'express'
import { InvalidPassword, PhoneNotFoundAtLogin } from "../helpers/domain-errors"
import jwt from 'jsonwebtoken';


const router = Router()
export interface LoginParams {
    phone: string;
    password: string
}
export const login = async (payload: LoginParams) => {

    const { phone, password } = payload


    // try-catch errors
    const {rows, rowCount} = await query(`
        SELECT name, id, password, role FROM users where phone=$1`,
        [phone]
    )

    if (rowCount === 0) {
        throw new PhoneNotFoundAtLogin
    }

    const arePasswordEqual = await bcrypt.compare(password, rows[0].password)

    if (!arePasswordEqual) {
        throw new InvalidPassword
    }

    const token = jwt.sign({
        phone,
        role: rows[0].role,
        userId: rows[0].id
    }, process.env.JWT_SECRET as string);

    return {token, name: rows[0].name}
}


router.post('/auth/login', async(req: Request, res: Response) => {

    const {phone, password} = req.body

    try {

        const result = await login({
            phone,
            password
        })

        return res.status(200).json(ok(result))

    } catch (error) {
        const err = error as Error
        if (err.name === 'PhoneNotFoundAtLogin') {
            return res.status(401).json(unauthorized(err.message))
        }

        if (err.name === 'InvalidPassword') {
            return res.status(401).json(unauthorized(err.message))
        }
    }

})

export const authRouter = router
