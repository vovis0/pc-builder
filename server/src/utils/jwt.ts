import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const signToken = (id: number) =>
  jwt.sign({ id }, SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET);