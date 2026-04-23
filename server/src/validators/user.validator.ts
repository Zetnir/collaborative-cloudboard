import { z } from "zod";

const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(2, "Username must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]).default("user"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  avatarUrl: z.string().url("Invalid URL").optional(),
});

export default UserSchema;
