import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import coupansRouter from "./routes/coupon.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"


dotenv.config()


const app = express()
const port = process.env.PORT || 3000


app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true
}))


app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/coupans', coupansRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/analytics', analyticsRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    connectDB()
})
