import api from "./axios";
import type { Component } from "../types";

export const componentsApi = {
  getAll: (category?: string) =>
    api.get<Component[]>("/components", { params: category ? { category } : {} }),
};