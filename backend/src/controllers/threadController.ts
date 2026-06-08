import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { io } from "../index";

export const CreateThread = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const { content } = req.body;

    const uploadPath = req.file
      ? `/uploads/threads/${req.file.filename}`
      : null;

    const thread = await prisma.threads.create({
      data: {
        content,
        image: uploadPath,
        created_by: userLogin.id,
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

    const threadWithLikeStatus = {
      ...thread,
      isLiked: false,
    };

    io.emit("thread:new", threadWithLikeStatus);

    return res.status(201).json({
      message: "theread di buat",
      data: threadWithLikeStatus,
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
    const userLogin = (req as any).user;

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

    const threadLikeStatus = thread.map((item) => ({
      ...item,
      isLiked: item.likes.some((like) => like.user_id === userLogin.id),
    }));

    return res.status(200).json({
      message: "berhasil mengambil semua postingan",
      data: threadLikeStatus,
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

export const createReply = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const userLogin = (req as any).user;

    const id = Number(threadId);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "thread id tidak valid",
      });
    }

    const thread = await prisma.threads.findUnique({
      where: {
        id: id,
      },
    });

    if (!thread) {
      return res.status(404).json({
        message: "thread tidak ditemukan",
      });
    }

    if (!content) {
      return res.status(404).json({
        message: "reply haurs di isi",
      });
    }

    const reply = await prisma.replies.create({
      data: {
        user_id: userLogin.id,
        thread_Id: id,
        content: content,
      },
    });

    await prisma.threads.update({
      where: {
        id: id,
      },
      data: {
        number_of_replies: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({
      message: "reply berhasil dibuat",
      data: reply,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
      error,
    });
  }
};
