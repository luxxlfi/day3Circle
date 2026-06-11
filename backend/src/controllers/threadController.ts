import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { io } from "../index";
import { Socket } from "socket.io";

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
        message: "thread tidak ditemukan",
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        user_id: userLogin.id,
        thread_id: threadId,
      },
    });

    let liked = false;

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      liked = false;
    } else {
      await prisma.like.create({
        data: {
          user_id: userLogin.id,
          thread_id: threadId,
        },
      });

      liked = true;
    }

    const likeTotal = await prisma.like.count({
      where: {
        thread_id: threadId,
      },
    });

    io.emit("like:update", {
      threadId,
      userId: userLogin.id,
      liked,
      likeTotal,
    });

    return res.status(200).json({
      message: liked ? "thread berhasil di-like" : "like dihapus",
      liked,
      likeTotal,
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
    console.log(req.file);
    const image = req.file ? `/uploads/reply/${req.file.filename}` : null;
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

    if (!content && !image) {
      return res.status(404).json({
        message: "reply haurs di isi",
      });
    }
    const reply = await prisma.replies.create({
      data: {
        user_id: userLogin.id,
        thread_Id: id,
        content: content,
        image: image,
      },
      include: {
        Users: {
          select: {
            id: true,
            username: true,
            photo_profile: true,
          },
        },
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

    if (thread.created_by !== userLogin.id) {
      io.to(`user-${thread.created_by}`).emit("reply-notification", {
        message: `${reply.Users.username} mengomentari postingan kamu`,
        threadId: thread.id,
        reply,
      });
    }

    io.emit("reply:new", {
      threadId: id,
      reply,
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
