import { prisma } from "../../db/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

export const register = async (req: any, res: any) => {
  const { username, password } = req.body;

  const existing = await prisma.users.findFirst({ where: { username } });
  if (existing) return res.status(400).json({ error: "User exists" });

  const user = await prisma.users.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });

  res.json({ token: signToken(user.id) });
};

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;

  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return res.status(400).json({ error: "Not found" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  res.json({ token: signToken(user.id) });
};




