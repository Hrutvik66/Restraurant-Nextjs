import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY: Secret = process.env.SECRET_KEY!;

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send({ message: "Please authenticate" });
  }
};
