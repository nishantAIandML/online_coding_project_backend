import express from "express";
import { createProblem,getProblems,getProblemById} from "../controllers/problem.controller.js";

const router = express.Router();
router.post("/create", createProblem);
router.get("/", getProblems); // public list
router.get("/:id", getProblemById);

export {router};
