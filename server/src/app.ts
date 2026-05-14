import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import componentsRoutes from "./modules/components/components.routes";
import buildsRoutes from "./modules/builds/build.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/components", componentsRoutes);
app.use("/builds", buildsRoutes);
app.use(errorMiddleware);

export default app;