import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../controllers/task.controller.js";
import validate from "../middleware/validate.js";
import taskSchema from "../validators/task.validator.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", validate(taskSchema), createTask);
router.put("/:id", validate(taskSchema), updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);

export default router;
