import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { use } from "react";

export const profile = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    console.log(userLogin);
    const user = await prisma.user.findUnique({
      where: {
        id: userLogin.id,
      },

      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
        createAt: true,
        follower: true,
        following: true,

        threads: {
          orderBy: {
            created_at: "desc",
          },

          include: {
            likes: true,
            thread: true,
            author: {
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

    if (!user) {
      return res.status(404).json({
        message: "user tidak di temukan",
      });
    }

    const userWithLikeStatus = {
      ...user,
      followierCount: user.follower.length,
      followingConunt: user.following.length,

      threads: user.threads.map((item) => ({
        ...item,
        isLiked: item.likes.some((like) => like.user_id === userLogin.id),
      })),
    };

    return res.status(200).json({
      message: "profile berhasil di ambil",
      deta: userWithLikeStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan",
    });
  }
};

export const EditProfile = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const { username, full_name, bio } = req.body;

    const user = await prisma.user.update({
      where: {
        id: userLogin.id,
      },
      data: {
        username,
        full_name,
        bio,
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
      },
    });

    return res.status(200).json({
      message: "profile berhasil di update",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({});
  }
};

export const GetAllUser = async (req: Request, res: Response) => {
  try {
    const userLogin = (req as any).user;
    const user = await prisma.user.findMany({
      where: {
        id: { 
          not: userLogin.id,
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
        bio: true,
        following: {
          where: {
            follower_id: userLogin.id,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const usersWithFollowStatus = user.map((item) => ({
      id: item.id,
      username: item.username,
      full_name: item.full_name,
      photo_profile: item.photo_profile,
      bio: item.bio,
      isFollowing: item.following.length > 0,
    }));

    return res.status(200).json({
      message: "berhasil menga,bil semua user",
      data: usersWithFollowStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};

export const GetUserByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userLogin = (req as any).user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
        threads: {
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
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user tidak di temukan",
      });
    }

    const threadsIsLiked = user.threads.map((thread) => ({
      ...thread,
      isLiked: thread.likes.some((like) => like.user_id === userLogin.id),
    }));

    return res.status(200).json({
      message: "berhasil ke profile user",
      data: {
        ...user,
        threads: threadsIsLiked,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "terado kesalahan server",
    });
  }
};

export const followUnfollow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userLogin = (req as any).user;

    const targetUserId = Number(id);

    if (userLogin.id === Number(id)) {
      return res.status(400).json({
        message: "tidak bisa follow diri sendiri",
      });
    }
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: userLogin.id,
        following_Id: Number(id),
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });

      return res.status(200).json({
        message: "berhasil unfolow user",
        isFoollowing: false,
      });
    }

    await prisma.follow.create({
      data: {
        follower_id: userLogin.id,
        following_Id: targetUserId,
      },
    });

    return res.status(200).json({
      message: "berhasil follow user",
      isFollowing: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan server",
    });
  }
};
