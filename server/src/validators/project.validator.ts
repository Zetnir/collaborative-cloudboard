import { z } from "zod";

const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().optional(),
  owner: z.string().min(1, "Owner ID is required"),
  members: z.array(z.string()).default([]),
  access: z.enum(["private", "public"]).default("private"),
  workspace: z.string().default("personal"),
  coverImgUrl: z.string().url().optional(),
});

export default ProjectSchema;
