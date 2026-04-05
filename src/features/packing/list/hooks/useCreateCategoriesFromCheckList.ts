import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createCategoriesFromCheckList } from "../services/api";
import type { CategoryWithItems } from "../../type";

interface CreateCategoriesResult {
  successCount: number;
  totalCount: number;
  failedCategories: string[];
  skippedCategories: string[];
}

interface UseCreateCategoriesFromCheckListOptions {
  onSuccess?: (result: CreateCategoriesResult) => void;
  onError?: (error: Error) => void;
}

export const useCreateCategoriesFromCheckList = (
  tripId: string,
  options?: UseCreateCategoriesFromCheckListOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: (CategoryWithItems & { category_type?: string })[]) => {
      return createCategoriesFromCheckList(tripId, categories);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["tripChecklist", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shoppingChecklist", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["todoChecklist", tripId],
      });

      const { successCount, skippedCategories, failedCategories } = result;

      if (successCount > 0 && skippedCategories.length === 0) {
        toaster.create({
          title: `${successCount}개 카테고리가 추가되었습니다!`,
          type: "success",
          duration: 2000,
        });
      } else if (successCount > 0 && skippedCategories.length > 0) {
        toaster.create({
          title: `${successCount}개 추가, ${skippedCategories.length}개 중복 건너뜀`,
          description: `중복: ${skippedCategories.join(", ")}`,
          type: "success",
          duration: 3000,
        });
      } else if (successCount === 0 && skippedCategories.length > 0) {
        toaster.create({
          title: "이미 존재하는 카테고리입니다",
          description: skippedCategories.join(", "),
          type: "warning",
          duration: 3000,
        });
      } else if (failedCategories.length > 0) {
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
