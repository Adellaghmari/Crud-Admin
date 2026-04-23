import type { Deal } from "../types";
import { api } from "./client";

type DealPayload = {
  customerId: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "WON" | "LOST";
};

export const dealsApi = {
  list: async () => {
    const { data } = await api.get<Deal[]>("/deals");
    return data;
  },
  create: async (payload: DealPayload) => {
    const { data } = await api.post<Deal>("/deals", payload);
    return data;
  },
  update: async (id: string, payload: DealPayload) => {
    const { data } = await api.put<Deal>(`/deals/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/deals/${id}`);
  },
};
