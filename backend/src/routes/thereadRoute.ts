import express from "express";
import {
  CreateThread,
  GetAllThereads,
  ToggleLikeThread,
} from "../controllers/threadController";
import { DetailThread } from "../controllers/detailThread";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadPath } from "../middleware/upload";
import { createReply } from "../controllers/threadController";

const router = express.Router();

router.post(
  "/posting",
  authMiddleware,
  uploadPath.single("image"),
  CreateThread,
);
router.get("/home", authMiddleware, GetAllThereads);
router.post("/:id/like", authMiddleware, ToggleLikeThread);
router.get("/:threadId", authMiddleware, DetailThread);
router.post(
  "/:threadId/reply",
  authMiddleware,
  uploadPath.single("image"),
  createReply,
);

export default router;
