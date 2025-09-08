import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteChecklistItem } from "../services/api";
import { queryKeys } from "./useTripChecklist";

interface UseDeleteItemOptions {
  onSuccess?: (itemId: string) => void;
  onError?: (error: Error, itemId: string) => void;
  showToast?: boolean;
}

export function useDeleteItem(tripId?: string, options?: UseDeleteItemOptions) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: (itemId: string) => {
      return deleteChecklistItem(itemId);
    },
    onSuccess: async (_, itemId) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tripChecklist(tripId),
        });
      }

      if (showToast) {
        toaster.create({
          title: "아이템이 삭제되었습니다",
          description: "아이템이 성공적으로 삭제되었습니다.",
          type: "success",
          duration: 3000,
        });
      }

      options?.onSuccess?.(itemId);
    },
    onError: async (error, itemId) => {
      if (showToast) {
        toaster.create({
          title: "아이템 삭제에 실패했습니다",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }

      options?.onError?.(error, itemId);
    },
  });
}
