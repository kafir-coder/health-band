import { NextFunction,  Request, Response} from "express";
import { forbiden } from "../helpers/http-helpers";
import jwt from 'jsonwebtoken';

export const hasToken = (req: Request, res: Response, next: NextFunction) => {

    const { authorization } = req.headers;

    const token = authorization?.slice(7, authorization.length)

    if (!/Bearer/g.test(authorization as string) || !authorization || token?.split('.').length !== 3) {
        return res.status(403).json(forbiden("token not informed or token malformed"))
    }

    //@ts-ignore
    req.user = jwt.decode(token)
    next()
}
