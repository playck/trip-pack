import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTripBudget } from "@/shared/service/tripInfo";

export const useUpdateTripBudget = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budget: number | null) => updateTripBudget(tripId, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripInfo", tripId] });
    },
  });
};
