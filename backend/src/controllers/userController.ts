import { Request, Response } from "express";
import prisma from "../lib/prisma";

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
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user tidak di temukan",
      });
    }

    return res.status(200).json({
      message: "profile berhasil di ambil",
      deta: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan",
    });
  }
};
