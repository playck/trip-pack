import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createCategoriesFromCheckList } from "../services/api";
import type { CategoryWithItems } from "../../type";

interface UseCreateCategoriesFromCheckListOptions {
  onSuccess?: (result: {
    successCount: number;
    totalCount: number;
    failedCategories: string[];
  }) => void;
  onError?: (error: Error) => void;
}

export const useCreateCategoriesFromCheckList = (
  tripId: string,
  options?: UseCreateCategoriesFromCheckListOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: CategoryWithItems[]) => {
      return createCategoriesFromCheckList(tripId, categories);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["tripChecklist", tripId],
      });

      const { successCount, totalCount, failedCategories } = result;

      if (successCount === totalCount) {
        // 모두 성공
        toaster.create({
          title: `${successCount}개 카테고리가 추가되었습니다!`,
          type: "success",
          duration: 2000,
        });
      } else if (successCount > 0) {
        // 일부 성공
        toaster.create({
          title: `${successCount} / ${totalCount}개 카테고리가 추가되었습니다`,
          description: `실패: ${failedCategories.join(", ")}`,
          type: "warning",
          duration: 3000,
        });
      } else {
        // 모두 실패
        toaster.create({
          title: "카테고리 추가 실패",
          description: `실패: ${failedCategories.join(", ")}`,
          type: "error",
          duration: 3000,
        });
      }

      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
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
