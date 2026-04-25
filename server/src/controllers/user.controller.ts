import { Request, Response } from "express";
import { User } from "../models/User.js";

interface UserDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: "user" | "admin";
  createdAt: Date;
}

const userToDto = (user: any): UserDto => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users.map(userToDto));
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch users",
      error,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userToDto(user));
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch user",
      error,
    });
  }
};
