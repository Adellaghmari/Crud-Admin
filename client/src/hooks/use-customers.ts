import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "../api/customers";
import type { CustomerStatus } from "../types";

type CustomerFilter = {
  page: number;
  pageSize: number;
  search: string;
  status: CustomerStatus | "ALL";
  sortOrder: "asc" | "desc";
};

export const useCustomers = (filter: CustomerFilter) => {
  return useQuery({
    queryKey: ["customers", filter],
    queryFn: () => customersApi.list(filter),
  });
};

export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCustomers = async () => {
    await queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  return {
    createMutation: useMutation({
      mutationFn: customersApi.create,
      onSuccess: invalidateCustomers,
    }),
    updateMutation: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof customersApi.update>[1] }) =>
        customersApi.update(id, payload),
      onSuccess: invalidateCustomers,
    }),
    deleteMutation: useMutation({
      mutationFn: customersApi.remove,
      onSuccess: invalidateCustomers,
    }),
  };
};
