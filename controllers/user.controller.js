import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";

import { generateToken } from "../utils/user.token.js";

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 2. Compare plain password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 2. Generate tokens
  const { accessToken, refreshToken } = generateToken(user);

  // 3. Save tokens in DB (optional)
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  // 4. Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevent JS access
    // secure: true,
    secure:true, // use true in production with HTTPS
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // change only in dev
    // secure:process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 5. Send response
  // res.json({ message: "Login successful" });
  res.json({
    message: "Login successful",
    token: accessToken, // JWT
    user: {
      username: user.username,
      id: user._id,
    },
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Logout User
const logoutUser = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true, // true in production with HTTPS
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // Optional: If you still want to remove tokens from DB (if user is logged in)
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $unset: { accessToken: "",refreshToken: "",},
      });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "problemsSolved",
      "title difficulty"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update Score & Problems Solved

export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
