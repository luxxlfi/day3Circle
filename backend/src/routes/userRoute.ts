import "dotenv/config";
import express from "express";
import {
  profile,
  GetUserByid,
  GetAllUser,
  EditProfile,
  followUnfollow
} from "../controllers/userController";
import { getFollowList } from "../controllers/follow";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, EditProfile);
router.get("/allUser", authMiddleware, GetAllUser);
router.get('/follow', authMiddleware, getFollowList);
router.get("/:id", authMiddleware, GetUserByid);
router.post("/follow/:id", authMiddleware, followUnfollow)


export default router;
