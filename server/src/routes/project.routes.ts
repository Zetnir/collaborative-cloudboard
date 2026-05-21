import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  moveColumn,
} from "../controllers/project.controller.js";
import validate from "../middleware/validate.js";
import projectSchema from "../validators/project.validator.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", validate(projectSchema), createProject);
router.put("/:id", validate(projectSchema), updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/move", moveColumn);

export default router;
