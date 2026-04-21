import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import "./config/db.js";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(express.json());

app.use("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

export default app;
