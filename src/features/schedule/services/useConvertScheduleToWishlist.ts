import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { convertScheduleToWishlist } from "./wishlistApi";

interface UseConvertScheduleToWishlistOptions {
  /**
   * 이 일정에 대한 작업이 끝났을 때 (옮겼거나, 서버에 이미 없어서 더 할 게 없을 때).
   * 두 경우 모두 목록이 갱신되므로 선택 상태는 정리해야 한다.
   */
  onDone?: () => void;
}

/**
 * 일정을 위시리스트(가고 싶은 곳)로 되돌리기
 */
export const useConvertScheduleToWishlist = (
  tripId: string,
  options?: UseConvertScheduleToWishlistOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) =>
      convertScheduleToWishlist({ scheduleId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      // 대상 일정이 서버에 이미 없던 경우
      if (!data) {
        toaster.create({
          title: "일정 목록이 최신이 아니었어요",
          description: "일정을 새로 불러왔습니다.",
          type: "info",
          duration: 3000,
        });

        options?.onDone?.();
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });
      // 연동 경비의 schedule_id 가 해제되므로 경비 목록도 갱신한다
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: "가고 싶은 곳으로 옮겼어요",
        type: "success",
        duration: 2000,
      });

      options?.onDone?.();
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
