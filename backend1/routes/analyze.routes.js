import express from "express";
import multer from "multer";
import { analyzeController, getHistory, getAnalysis } from "../controllers/analyze.controller.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("file"), analyzeController);

router.get("/history", getHistory);

router.get("/analysis/:id", getAnalysis);

export default router;