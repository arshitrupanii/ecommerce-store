import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js"
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()


const app = express()
const port = process.env.PORT || 3000


app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());



app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)



app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`)
    connectDB()
})
