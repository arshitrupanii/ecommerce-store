import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const dotenv = configDotenv().parsed
const MONGO_URI = dotenv.MONGO_URI

const connectDB = async () => {
    try {
        const conn = await mongoose.connect( MONGO_URI , {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        },)
        console.log(`Mongodb connected ✅ ${conn.connection.host}`)

    } catch (error) {
        console.log("Error in Connect to DB", error)
        process.exit(1);
    }
}

export default connectDB