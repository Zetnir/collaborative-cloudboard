import { z } from "zod";

const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().default("todo"),
  project: z.string().min(1, "Project ID is required"),
  assignee: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  priority: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  comments: z
    .array(
      z.object({
        user: z.string().min(1, "User ID is required"),
        text: z.string().min(1, "Comment text is required"),
        createdAt: z.coerce.date().default(() => new Date()),
      }),
    )
    .default([]),
  order: z.number().default(0),
});

export default TaskSchema;
