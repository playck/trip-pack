import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { convertWishlistToSchedule } from "./wishlistApi";

interface UseConvertWishlistToScheduleOptions {
  onSuccess?: () => void;
}

/**
 * 위시리스트 항목을 특정 일차의 일정으로 전환
 */
export const useConvertWishlistToSchedule = (
  tripId: string,
  tripStartDate: string,
  options?: UseConvertWishlistToScheduleOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { wishlistId: string; dayNumber: number }) =>
      convertWishlistToSchedule({ ...params, tripId, tripStartDate }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: `${variables.dayNumber}일차 일정으로 추가했어요`,
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "일정 추가 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    },
  });
};
