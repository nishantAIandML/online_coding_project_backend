// controllers/problemController.js
import { Problem } from "../models/problem.models.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      constraints,
      publicTestCases,
      hiddenTestCases,
      solution,
      solutionTimeComplexity,
      solutionSpaceComplexity,
      score
    } = req.body;

    // Basic validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and difficulty are required"
      });
    }

    // Create new problem
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      publicTestCases,
      hiddenTestCases,
      solution,
      solutionTimeComplexity,
      solutionSpaceComplexity,
      score
    });

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem
    });

  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getProblems = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;
    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty; // e.g., "Easy"
    }

    if (tag) {
      filter.tags = { $in: [tag] }; // e.g., "Array"
    }

    const problems = await Problem.find(filter).select("-hiddenTestCases -solution");

    res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });

  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get a single problem by ID
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id).select("-hiddenTestCases -solution");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    res.status(200).json({
      success: true,
      problem
    });

  } catch (error) {
    console.error("Error fetching problem by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};