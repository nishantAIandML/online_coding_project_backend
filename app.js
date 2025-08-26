import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL||"http://localhost:5173",
    credentials: true,
  })
);

import {router as userRouter} from "./routes/user.routes.js";
import {router as problemRouter} from "./routes/problem.routes.js";
import {router as submissionRouter} from "./routes/submission.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);
export default app;