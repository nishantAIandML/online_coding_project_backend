import { Submission } from "../models/submission.models.js";
import { Runcode } from "../compiler/runCode.js";
import { Problem } from "../models/problem.models.js";
import { User } from "../models/user.models.js";
import axios from "axios";
export const createSubmission = async (req, res) => {
  try {
    console.log(req.user);
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }
    const userId = req.user.id;
    const { problemId, code, language } = req.body; // Now userId comes from JSON

    // 1️⃣ Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    // 2️⃣ Merge test cases
    const allTestCases = [
      ...problem.publicTestCases,
      ...problem.hiddenTestCases,
    ];

    if (allTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases found for this problem.",
      });
    }

    let passedCount = 0;
    const results = [];

    // 3️⃣ Run code for each test case
    for (const testCase of allTestCases) {
      try {
        // Example: sending to an external compiler API
        const response = await axios.post(
          "http://localhost:3000/api/v1/submissions/compile",
          {
            language,
            code,
            stdin: testCase.input,
          }
        );

        const userOutput = response.data.output.trim();
        const expectedOutput = testCase.output.trim();

        const passed = userOutput === expectedOutput;
        if (passed) passedCount++;

        results.push({
          input: testCase.input,
          expectedOutput,
          userOutput,
          passed,
        });
      } catch (err) {
        results.push({
          input: testCase.input,
          error: err.message,
          passed: false,
        });
      }
    }

    // 4️⃣ Save submission
    const submission = await Submission.create({
      problem: problemId, // Assuming your schema has `problem` as ref
      user: userId, // Now we store from JSON
      code,
      language,
      results,
      score:
        passedCount === allTestCases.length ? Number(problem?.score) || 0 : 0,
      status: passedCount === allTestCases.length ? "Accepted" : "Wrong Answer",
    });

    if (passedCount === allTestCases.length) {
      const user = await User.findById(userId);
      if (user && !user.problemsSolved.includes(problemId)) {
        user.problemsSolved.push(problemId);
        user.totalScore += Number(problem?.score) || 0;
        await user.save();
      }
    }
    // 5️⃣ Return response
    res.json({
      success: true,
      totalCases: allTestCases.length,
      passedCases: passedCount,
      results,
      score: submission.score,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const compileProblem = async (req, res) => {
  const { code, language, stdin } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    // Pass stdin if available
    const output = await Runcode(language, code, stdin || "");

    return res.status(200).json({
      success: true,
      output: output.trim(),
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
