import express from "express";
import { createBuild } from "./build.controller";

const router = express.Router();

/**
 * Создать сборку
 * POST /builds
 */
router.post("/", createBuild);

export default router;