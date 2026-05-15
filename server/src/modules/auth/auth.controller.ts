import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma";
import { generateToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    console.log("REGISTER BODY:", req.body);

    // Validation
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "Username is required",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        error: "Password too short",
      });
    }

    // Existing user
    const existingUser = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // JWT
    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
      });
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    // JWT
    const token = generateToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};