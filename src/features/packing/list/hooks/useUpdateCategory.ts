import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateChecklistCategory } from "../services/api";
import type { UseUpdateCategoryParams } from "../../type";

interface UseUpdateCategoryOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateCategory = (
  tripId: string,
  options?: UseUpdateCategoryOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UseUpdateCategoryParams) => {
      return updateChecklistCategory(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripChecklist", tripId],
      });

      toaster.create({
        title: "카테고리가 수정되었습니다!",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("카테고리 수정 실패:", error);

      toaster.create({
        title: "카테고리 수정 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
};
