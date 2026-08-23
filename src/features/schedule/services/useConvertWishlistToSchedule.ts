import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { convertWishlistToSchedule } from "./wishlistApi";

interface UseConvertWishlistToScheduleOptions {
  /**
   * 이 항목에 대한 작업이 끝났을 때 (일정으로 옮겼거나, 서버에 이미 없어서 더 할 게 없을 때).
   * 두 경우 모두 목록이 갱신되므로 선택 상태는 정리해야 한다.
   */
  onDone?: () => void;
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
      convertWishlistToSchedule({ ...params, tripStartDate }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });

      // 대상 항목이 서버에 이미 없던 경우 — 일정은 만들어지지 않았다.
      // 원인(일행이 정리함 / 접근 권한 상실)까지는 단정할 수 없으므로 사실만 말한다.
      if (!data) {
        toaster.create({
          title: "목록이 최신이 아니었어요",
          description: "가고 싶은 곳 목록을 새로 불러왔습니다.",
          type: "info",
          duration: 3000,
        });

        options?.onDone?.();
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: `${variables.dayNumber}일차 일정으로 추가했어요`,
        type: "success",
        duration: 2000,
      });

      options?.onDone?.();
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
