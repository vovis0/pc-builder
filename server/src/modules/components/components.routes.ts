import express from "express";
import { getComponents } from "./components.controller";

const router = express.Router();

router.get("/", getComponents);

export default router;