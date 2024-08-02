import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
import process from "process"


const connectDB = async () => {
    try {
        if (!process.env.DB_URI || !process.env.DB_NAME) {
            console.error('Environment variables URI and NAME must be defined.');
            process.exit(1);
        }
        const instance = await mongoose.connect(process.env.DB_URI)
        console.log(`DB connected -> ${process.env.DB_NAME} Active : ${instance.connection.host}${instance.connection.port}`);
    } catch (error) {
        console.error(`DB not connected -> ${process.env.DB_NAME} Inactive : ${process.env.DB_URI} ${error}`);
        process.exit(1);
    }
}

export default connectDB