import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createSchedule } from "./api";
import { deleteWishlistByPlaceId } from "./wishlistApi";
import type { CreateScheduleParams, Schedule } from "../types";

interface UseCreateScheduleOptions {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: Error) => void;
}

export const useCreateSchedule = (
  tripId: string,
  options?: UseCreateScheduleOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Omit<CreateScheduleParams, "visitOrder">) => {
      const cached =
        queryClient.getQueryData<Schedule[]>(["tripSchedules", tripId]) ?? [];
      const lastOrder = cached
        .filter((s) => s.day_number === params.dayNumber)
        .reduce((max, s) => Math.max(max, s.visit_order), 0);

      return createSchedule({
        ...params,
        visitOrder: lastOrder + 1,
      });
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      // 일정에 배치된 장소는 위시리스트(대기 목록)에서 자동으로 소비한다
      try {
        const removed = await deleteWishlistByPlaceId(
          tripId,
          variables.placeId
        );
        if (removed > 0) {
          queryClient.invalidateQueries({
            queryKey: ["tripWishlists", tripId],
          });
        }
      } catch {
        // 정리 실패는 일정 추가 자체에 영향 없음 — 무시
      }

      toaster.create({
        title: "일정이 추가되었습니다",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toaster.create({
        title: "일정 추가 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
};
