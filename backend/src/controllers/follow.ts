import prisma from "../lib/prisma";
import { Response, Request } from "express";
import { DetailThread } from "./detailThread";

export const getFollowList = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const user = await prisma.user.findUnique({
      where: {
        id: userLogin.id,
      },
      select: {
        follower: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                bio: true,
              },
            },
          },
        },

        following: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user tidak di temukan",
      });
    }

    return res.status(200).json({
      message: "berhasil mengambil data follow",
      data: {
        follower: user.follower.map((item) => item.following),
        following: user.following.map((item) => item.follower),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};
