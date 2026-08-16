import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { convertScheduleToWishlist } from "./wishlistApi";

interface UseConvertScheduleToWishlistOptions {
  onSuccess?: () => void;
}

/**
 * 일정을 위시리스트(가고 싶은 곳)로 되돌리기
 */
export const useConvertScheduleToWishlist = (
  tripId: string,
  options?: UseConvertScheduleToWishlistOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) =>
      convertScheduleToWishlist({ scheduleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: "가고 싶은 곳으로 옮겼어요",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "가고 싶은 곳으로 옮기기 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    },
  });
};
