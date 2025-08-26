import mongoose from "mongoose";

const { Schema } = mongoose;

const testCaseSchema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const problemSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: [{ type: String }],
    constraints: { type: String },

    publicTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],

    solution: { type: String },
    solutionTimeComplexity: { type: String },
    solutionSpaceComplexity: { type: String },

    score: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);
