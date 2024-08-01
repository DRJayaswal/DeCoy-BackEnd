import { connectDB } from "./src/database/index.db.js"
import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"

const ServerPort = process.env.SERVER_PORT || 3000
const ServerName = process.env.SERVER_NAME || "Express"
const DatabaseName = process.env.DB_NAME || "MongoDB"
connectDB()
    .then(app.listen(ServerPort, () => {
        console.log(`Server -> ${ServerName} Active : ${ServerPort}`);
    }))
    .catch((error)=>{
        console.log(`DB -> ${DatabaseName} Inactive : ${error}`);
    })