import express from "express";
import multer from "multer";
import { uploadImage, getImageInfo } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadImage);
router.get("/", getImageInfo);

export default router;
