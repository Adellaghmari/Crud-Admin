import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "../api/deals";

export const useDeals = () => {
  return useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.list,
  });
};

export const useDealMutations = () => {
  const queryClient = useQueryClient();
  const invalidateDeals = async () => {
    await queryClient.invalidateQueries({ queryKey: ["deals"] });
  };

  return {
    createMutation: useMutation({
      mutationFn: dealsApi.create,
      onSuccess: invalidateDeals,
    }),
    deleteMutation: useMutation({
      mutationFn: dealsApi.remove,
      onSuccess: invalidateDeals,
    }),
  };
};
