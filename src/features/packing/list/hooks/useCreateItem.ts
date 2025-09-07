import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createChecklistItem } from "../services/api";
import { queryKeys } from "./useTripChecklist";
import type { UseCreateItemParams } from "../../type";

interface UseCreateItemOptions {
  onSuccess?: (data: { id: string }, variables: UseCreateItemParams) => void;
  onError?: (error: Error, variables: UseCreateItemParams) => void;
  showToast?: boolean;
}

export function useCreateItem(tripId?: string, options?: UseCreateItemOptions) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: ({ categoryId, name, notes }: UseCreateItemParams) => {
      return createChecklistItem({ categoryId, name, notes });
    },
    onSuccess: async (data, variables) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tripChecklist(tripId),
        });
      }

      if (showToast) {
        toaster.create({
          title: "아이템이 추가되었습니다",
          description: `"${variables.name}" 아이템이 성공적으로 추가되었습니다.`,
          type: "success",
          duration: 3000,
        });
      }

      options?.onSuccess?.(data, variables);
    },
    onError: async (error, variables) => {
      if (showToast) {
        toaster.create({
          title: "아이템 추가에 실패했습니다",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }

      options?.onError?.(error, variables);
    },
  });
}
