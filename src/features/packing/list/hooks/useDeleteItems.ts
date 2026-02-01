import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteChecklistItems } from "../services/api";
import { queryKeys } from "./useTripChecklist";
import type { CategoryWithItems } from "../../type";

interface UseDeleteItemsOptions {
  onSuccess?: (itemIds: string[]) => void;
  onError?: (error: Error, itemIds: string[]) => void;
}

export function useDeleteItems(
  tripId?: string,
  options?: UseDeleteItemsOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => {
      return deleteChecklistItems(itemIds);
    },
    onMutate: async (itemIds) => {
      if (!tripId) return;

      const queryKey = queryKeys.tripChecklist(tripId);
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<CategoryWithItems[]>(queryKey);

      if (previousData) {
        const idSet = new Set(itemIds);
        const updatedData = previousData.map((category) => ({
          ...category,
          items: category.items.filter((item) => item.id && !idSet.has(item.id)),
        }));
        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData };
    },
    onSuccess: (_, itemIds) => {
      toaster.create({
        title: `${itemIds.length}개 아이템이 삭제되었습니다`,
        type: "success",
        duration: 3000,
      });

      options?.onSuccess?.(itemIds);
    },
    onError: (error, itemIds, context) => {
      if (tripId && context?.previousData) {
        queryClient.setQueryData(
          queryKeys.tripChecklist(tripId),
          context.previousData,
        );
      }

      toaster.create({
        title: "아이템 삭제에 실패했습니다",
        description: error.message,
        type: "error",
        duration: 5000,
      });

      options?.onError?.(error, itemIds);
    },
    onSettled: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tripChecklist(tripId),
        });
      }
    },
  });
}
