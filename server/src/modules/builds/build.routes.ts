import express from "express";
import { createBuild, getBuilds } from "./build.controller";

const router = express.Router();
import { authMiddleware } from "../../middleware/auth.middleware";
router.get("/", authMiddleware, getBuilds);
router.post("/", authMiddleware, createBuild);
/**
 * Создать сборку
 * POST /builds
 */
router.post("/", createBuild);

export default router;