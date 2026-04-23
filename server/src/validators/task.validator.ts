import { z } from "zod";

const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  project: z.string().min(1, "Project ID is required"),
  assignee: z.string().optional(),
  order: z.number().default(0),
});

export default TaskSchema;
