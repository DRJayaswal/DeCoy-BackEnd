// import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
import process from "process"

export const connectDB = async () => {
    try {
        const instance = await mongoose.connect(process.env.DB_URI)
        console.log(`DB connected -> ${process.env.DB_NAME} Active : ${instance.connection.host}`);
    } catch (error) {
        console.error(`DB not connected -> ${process.env.DB_NAME} Inactive : ${process.env.DB_URI} ${error}`);
        process.exit(1);
    }

}
