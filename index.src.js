import {connectDB} from "./src/database/index.db.js"
import express, { request, response } from "express"

const app = express()
const ServerPort = process.env.SERVER_PORT || 3000
const ServerName = process.env.SERVER_NAME || "Express"
app.use("/api",(error,request,response,next)=>{
    response.send("Hello")
})
app.listen(ServerPort,()=>{
    console.log(`Server -> ${ServerName} Active : ${ServerPort}`);
})

connectDB()