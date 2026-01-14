import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const ConnectDB =async ()=>{
    try {
        const connnectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("The DataBase is connected Succesfully");
        console.log("FINAL URI:", `${process.env.MONGODB_URI}/${DB_NAME}`);

    } catch (error) {
        console.error("ERR :",error)
        process.exit(1)
    }
};

export default ConnectDB;