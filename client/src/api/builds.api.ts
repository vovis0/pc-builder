import api from "./axios";
import type { Build } from "../types";

export const buildsApi = {
  create: (userId: number, name: string, components: { id: number; type: string }[]) =>
    api.post<Build>("/builds", { userId, name, components }),

  getAll: () =>
    api.get<Build[]>("/builds"),
};