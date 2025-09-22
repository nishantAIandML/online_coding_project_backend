import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // change to your user model name
      required: true
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ["cpp", "py", "c"],
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Wrong Answer", "Runtime Error"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
