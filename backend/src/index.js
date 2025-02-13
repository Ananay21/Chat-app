import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app,server} from "./lib/socket.js";
import path from "path";

dotenv.config();
const __dirname=path.resolve();


app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
// route declaration
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

server.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`);
    connectDB();
}) 