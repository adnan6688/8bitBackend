import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { GlobalErrorHandler } from './middleware/globalErrorHandler'
import { userRoutes } from './modules/users/user.route'
import { NotFound } from './middleware/notFound'
import helmet from 'helmet'
import { authRoutes } from './modules/auth/auth.route'
import { gamesRoute } from './modules/games/games.route'
import { categoryRoutes } from './modules/cetegory/cetegory.route'
import { foodsRoute } from './modules/foods/foods.route'
import { cartRoutes } from './modules/cart/cart.route'
import { gameBookingRoute } from './modules/gamebooking/gamebooking.route'
const app: Application = express()


app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to our 8Bit Site!')
})


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/games', gamesRoute)
app.use('/api/category', categoryRoutes)
app.use('/api/foods', foodsRoute)
app.use('/api/cart' , cartRoutes)
app.use('/api/booking',gameBookingRoute)




// not found middleware 
app.use(NotFound)

// globalError Handle
app.use(GlobalErrorHandler)


export default app