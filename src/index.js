import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";   
const app=express()
import dotenv, { configDotenv } from "dotenv"
dotenv.config()
import ConnectDB from "./db/index.js";


ConnectDB()

// (async ()=>{
//         try {
//            await moongose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)    
//            app.on("error",(error)=>{
//             console.log("ERRR: ",error);
//             throw error
//            })

//            app.listen(process.env.PORT,()=>{
//                 console.log(`App is listening on port ${process.env.PORT}`)
//            })
//         } catch (error) {
//             console.error(error)
//             throw err
//         }
// })()

