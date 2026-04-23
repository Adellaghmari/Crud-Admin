import type { Customer, CustomerStatus, PaginatedCustomers } from "../types";
import { api } from "./client";

type CustomerPayload = {
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  notes?: string;
};

export const customersApi = {
  list: async (params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: CustomerStatus | "ALL";
    sortOrder: "asc" | "desc";
  }) => {
    const { data } = await api.get<PaginatedCustomers>("/customers", {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        sortOrder: params.sortOrder,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.status && params.status !== "ALL" ? { status: params.status } : {}),
      },
    });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Customer>(`/customers/${id}`);
    return data;
  },
  create: async (payload: CustomerPayload) => {
    const { data } = await api.post<Customer>("/customers", payload);
    return data;
  },
  update: async (id: string, payload: CustomerPayload) => {
    const { data } = await api.put<Customer>(`/customers/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/customers/${id}`);
  },
};
