import api from "./axios";

export interface AuthResponse {
  token: string;

  user: {
    id: number;
    username: string;
  };
}

export const authApi = {
  register: (
    username: string,
    password: string
  ) =>
    api.post<AuthResponse>(
      "/auth/register",
      {
        username,
        password,
      }
    ),

  login: (
    username: string,
    password: string
  ) =>
    api.post<AuthResponse>(
      "/auth/login",
      {
        username,
        password,
      }
    ),
};