import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB= async ()=>{
    try{
        // await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        await mongoose.connect(process.env.MONGO_URI,{
            dbName: process.env.DB_NAME
        });
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
export default connectDB;