import "dotenv/config";
import express from "express";
import { profile } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, profile);

export default router;
