import { api } from "./client";
import type { User } from "../types";

type AuthResponse = {
  token: string;
  user: User;
};

export const authApi = {
  register: async (payload: { name: string; email: string; password: string }) => {
    const { data } = await api.post<{ user: User }>("/auth/register", payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  },
  logout: async () => {
    await api.post("/auth/logout");
  },
};
