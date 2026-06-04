import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import Jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, full_name, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "pastikan semua sudah terisi!",
      });
    }

    const userDB = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userDB) {
      return res.status(400).json({
        message: "email sidah di gunakan",
      });
    }
    const hashPw1 = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        username,
        full_name,
        password: hashPw1,
      },
    });
    return res.status(201).json({
      message: "Register Berhasi",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "terjadi kesalahan saat register",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email / password salah!",
      });
    }

    const falidasiDb = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!falidasiDb) {
      return res.status(400).json({
        message: "email / paswword salah!",
      });
    }

    const pwMatch = await bcrypt.compare(password, falidasiDb.password);

    if (!pwMatch) {
      return res.status(400).json({
        message: "email / password salah",
      });
    }

    const token = Jwt.sign(
      {
        id: falidasiDb.id,
        email: falidasiDb.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "login berhasi;",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "terjadi kesalahan saat login",
    });
  }
};
