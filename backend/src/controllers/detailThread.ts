import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const DetailThread = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;

    const { threadId } = req.params;

    const id = Number(threadId);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "thread id tidak valid",
      });
    }

    const thread = await prisma.threads.findFirst({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
        likes: true,
        thread: {
          orderBy: {
            createAt: "desc",
          },
          include: {
            Users: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
              },
            },
          },
        },
      },
    });

    if (!thread) {
      return res.status(404).json({
        message: "thread tidak ditemukan",
      });
    }
    const threadWithLikeStatus = {
      ...thread,
      isLiked: thread.likes.some((like) => like.user_id === userLogin.id),
    };

    return res.status(200).json({
      message: "thread berhasil diambil",
      data: threadWithLikeStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
      error,
    });
  }
};
