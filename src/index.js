import mongoose from "mongoose";
import { app } from "./app.js";
import { DB_NAME } from "./constants.js";   
import dotenv, { configDotenv } from "dotenv"
dotenv.config()
import ConnectDB from "./db/index.js";


ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`The connection is SUCCESFULLY connected to ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("The is Not connected :",error)
})
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

