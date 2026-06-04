import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "error",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "token tidak falid",
    });
  }


  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded
    next();
  } catch (error) {
    return res.status(401).json({
      message: "token todak falid",
    });
  }
};
