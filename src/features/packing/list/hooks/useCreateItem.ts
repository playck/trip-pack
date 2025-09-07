import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createChecklistItem, updateChecklistItem } from "../services/api";
import { queryKeys } from "./useTripChecklist";
import type { UseCreateItemParams, UseUpdateItemParams } from "../../type";

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

interface UseUpdateItemOptions {
  onSuccess?: (variables: UseUpdateItemParams) => void;
  onError?: (error: Error, variables: UseUpdateItemParams) => void;
  showToast?: boolean;
}

export function useUpdateItem(tripId?: string, options?: UseUpdateItemOptions) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: ({ itemId, name, notes }: UseUpdateItemParams) => {
      return updateChecklistItem({ itemId, name, notes });
    },
    onSuccess: async (_, variables) => {
      // 기본 처리: query invalidation
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tripChecklist(tripId),
        });
      }

      // 기본 처리: 성공 토스터
      if (showToast) {
        toaster.create({
          title: "아이템이 수정되었습니다",
          description: `"${variables.name}" 아이템이 성공적으로 수정되었습니다.`,
          type: "success",
          duration: 3000,
        });
      }

      // 커스텀 콜백 실행
      options?.onSuccess?.(variables);
    },
    onError: async (error, variables) => {
      // 기본 처리: 에러 토스터
      if (showToast) {
        toaster.create({
          title: "아이템 수정에 실패했습니다",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }

      // 커스텀 콜백 실행
      options?.onError?.(error, variables);
    },
  });
}
