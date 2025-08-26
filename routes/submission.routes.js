import express from "express";
import { createSubmission,compileProblem,aiReviewController} from "../controllers/submission.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware,createSubmission);
router.post("/compile",compileProblem);
router.post("/ai-review", aiReviewController);
export {router};
