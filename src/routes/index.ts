import { Application } from 'express'

import { authRouter } from './auth'
import { userRouter } from './users'
import { sensorsRouter } from './sensors'

export const mountRoutes = (app: Application) => {
    app.use(authRouter)
    app.use(userRouter)
    app.use(sensorsRouter)
}
