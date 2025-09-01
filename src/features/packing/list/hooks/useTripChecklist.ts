import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTripChecklist, updateItemCheckedStatus } from "./api";
import type {
  UseTripChecklistReturn,
  UseUpdateItemCheckedStatusParams,
} from "../../type";

export function useTripChecklist(
  tripId: string | undefined
): UseTripChecklistReturn {
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tripChecklist", tripId],
    queryFn: () => {
      if (!tripId) {
        throw new Error("Trip ID가 필요합니다.");
      }
      return getTripChecklist(tripId);
    },
    enabled: !!tripId,
  });

  return {
    categories,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useUpdateItemCheckedStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isChecked }: UseUpdateItemCheckedStatusParams) => {
      return updateItemCheckedStatus(itemId, isChecked);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripChecklist"],
      });
    },
    onError: (error) => {
      console.error("체크리스트 아이템 업데이트 실패:", error);
    },
  });
}
