import express from "express";
import {
  CreateThread,
  GetAllThereads,
  ToggleLikeThread,
} from "../controllers/threadController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/posting", authMiddleware, CreateThread);
router.get("/home", authMiddleware, GetAllThereads);
router.post("/:id/like", authMiddleware, ToggleLikeThread);

export default router;
