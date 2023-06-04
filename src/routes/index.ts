import { Application } from 'express'

import { userRouter } from './users'
import { sensorsRouter } from './sensors'

export const mountRoutes = (app: Application) => {
    app.use(userRouter)
    app.use(sensorsRouter)
}
