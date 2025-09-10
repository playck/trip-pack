import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createChecklistCategory } from "../services/api";
import type { UseCreateCategoryParams } from "../../type";

interface UseCreateCategoryOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateCategory = (
  tripId: string,
  options?: UseCreateCategoryOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<UseCreateCategoryParams, "tripId">) => {
      return createChecklistCategory({
        tripId,
        ...params,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripChecklist", tripId],
      });

      toaster.create({
        title: "카테고리가 추가되었습니다!",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("카테고리 생성 실패:", error);

      toaster.create({
        title: "카테고리 추가 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
};
