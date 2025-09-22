import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173" , process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin:allowedOrigins,
  credentials:true,
}))

import {router as userRouter} from "./routes/user.routes.js";
import {router as problemRouter} from "./routes/problem.routes.js";
import {router as submissionRouter} from "./routes/submission.routes.js";
import { all } from "axios";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);
export default app;