import jwt from "jsonwebtoken";

export const generateToken = (
  id: string,
  expiresIn: number = 60 * 60 * 24 * 7, // Default to 7 days
) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: expiresIn });
};
