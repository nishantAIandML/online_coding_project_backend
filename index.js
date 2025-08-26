import dotenv from "dotenv";
import connectDB from "./db/db.js";
// import express from "express";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

// const app=express();
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
