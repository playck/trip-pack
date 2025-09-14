import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { queryKeys } from "./useTripChecklist";
import { deleteChecklistCategory } from "../services/api";

interface UseDeleteCategoryParams {
  onSuccess?: (categoryId: string) => void;
  onError?: (error: Error) => void;
}

export function useDeleteCategory(
  tripId?: string,
  callback?: UseDeleteCategoryParams
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (categoryId: string) => deleteChecklistCategory(categoryId),
    onSuccess: (_, categoryId) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tripChecklist(tripId),
        });
      }

      toaster.create({
        title: "카테고리가 삭제되었습니다",
        description: "카테고리와 관련된 모든 아이템이 삭제되었습니다",
        type: "success",
        duration: 2500,
      });

      if (tripId) {
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
          search: { tripTitle: undefined },
        });
      }

      callback?.onSuccess?.(categoryId);
    },
    onError: (error: Error) => {
      toaster.create({
        title: "카테고리 삭제 실패",
        description: error.message,
        type: "error",
        duration: 2500,
      });

      callback?.onError?.(error);
    },
  });
}
