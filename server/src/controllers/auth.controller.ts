import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      passwordHash,
      firstName,
      lastName,
    });
    await user.save();

    const accessToken = generateToken(user._id.toString(), 60 * 60); // Access token valid for 60 minutes
    const refreshToken = generateToken(user._id.toString(), 60 * 60 * 24 * 7); // Refresh token valid for 7 days

    res.status(201).json({
      user: userToDTO(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(user._id.toString(), 60 * 60); // Access token valid for 60 minutes
    const refreshToken = generateToken(user._id.toString(), 60 * 60 * 24 * 7); // Refresh token valid for 7 days

    res.json({
      user: userToDTO(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: userToDTO(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const userToDTO = (user: any) => ({
  // Exclude passwordHash and other sensitive fields
  id: user._id,
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  avatarUrl: user.avatarUrl,
  role: user.role,
});
