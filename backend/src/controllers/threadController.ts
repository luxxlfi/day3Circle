import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const CreateThread = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const { content } = req.body;
    const thread = await prisma.threads.create({
      data: {
        content,
        created_by: userLogin.id,
      },
    });

    return res.status(201).json({
      message: "theread di buat",
      data: thread,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};

export const GetAllThereads = async (req: Request, res: Response) => {
  try {
    const thread = await prisma.threads.findMany({
      orderBy: {
        created_at: "desc",
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
        thread: true,
      },
    });
    return res.status(200).json({
      message: "berhasil mengambil semua postingan",
      data: thread,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};

// like fungsi

export const ToggleLikeThread = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const threadId = Number(req.params.id);

    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return res.status(404).json({
        massage: "thread tidak ditemukan ",
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        user_id: userLogin.id,
        thread_id: threadId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({
        message: "like dihapus",
        liked: false,
      });
    }

    await prisma.like.create({
      data: {
        user_id: userLogin.id,
        thread_id: threadId,
      },
    });

    return res.status(201).json({
      message: "thread berhasil di-like",
      liked: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};
