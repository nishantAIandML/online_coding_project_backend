import { Submission } from "../models/submission.models.js";
import { Problem } from "../models/problem.models.js";
import { User } from "../models/user.models.js";
import axios from "axios";


export const compileProblem = async (req, res) => {
  const { code, language, input } = req.body;

  try {
    const response = await axios.post("http://localhost:3001/api/v1/compiler/execute", {
      code,
      language,
      input
    });

    return res.status(200).json({
      success: true,
      output: response.data.output.trim(),
    });
  } catch (error) {
    console.error("Compilation error:", error);
    return res.status(500).json({
      success: false,
      message: "Compilation failed",
      error: error.message,
    });
  }
};

// controllers/aiReviewController.js
// import { GeminiClient } from "@gemini-ai/client";

// Initialize Gemini client with your API key from environment variables
// controllers/aiReviewController.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ store in .env
});

export const aiReviewController = async (req, res) => {
  try {
    const { code, language, problemId, problemTitle } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: code, language, or problemId",
      });
    }

    // Construct the prompt
    const prompt = `
      Review this ${language} code for the problem "${problemTitle || problemId}":
      ${code}
      Provide feedback, suggestions, and improvements.
    `;

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      review: response.text,
    });
  } catch (err) {
    console.error("Gemini AI error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error while generating AI review",
    });
  }
};


// Normalize outputs for comparison
export const createSubmission = async(req,res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user?.id; // Get user ID from auth middleware
  
  if (!problemId || !code || !language) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: problemId, code, or language"
    });
  }

  // Optional: Add user validation if you want to require authentication
  // if (!userId) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "User not authenticated"
  //   });
  // }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const testcases = problem.hiddenTestCases;
    const l = [];
    for(let i = 0; i < testcases.length; i++) {
      l.push({input: testcases[i].input, output: testcases[i].output});
    }

    const response = await axios.post("http://localhost:3001/api/v1/compiler/execute-tests", {
      code,
      language,
      testCases: l,
    });

    

    // Save submission to database
    const submission = await Submission.create({
      user:userId,
      problem:problemId,
      code,
      language,
      status: response.data.summary.passed === response.data.summary.total ? "Accepted" : "Wrong Answer"
    });

    const user=await User.findById(userId);
    if(user.problemsSolved.includes(problemId)===false && response.data.summary.passed===response.data.summary.total){
      user.totalScore+=problem.score;
      user.problemsSolved.push(problemId);
      await user.save();
    }

    return res.json({
      success: true,
      testCasesPassed: response.data.summary.passed,
      totalTestCases: response.data.summary.total,
      status: response.data.summary.passed === response.data.summary.total ? "Accepted" : "Wrong Answer",
      userId: userId || null, // Include user ID if available
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing submission",
      error: error.message
    });
  }
};


