import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    problemsSolved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Problem"
      }
    ],
    totalScore: {
      type: Number,
      default: 0
    },
    accessToken: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);



export const User=mongoose.model("User", userSchema);
