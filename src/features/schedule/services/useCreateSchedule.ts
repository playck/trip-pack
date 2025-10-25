import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createSchedule, getLastVisitOrder } from "./api";
import type { CreateScheduleParams } from "../types";

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
      const lastOrder = await getLastVisitOrder(
        params.tripId,
        params.dayNumber
      );

      return createSchedule({
        ...params,
        visitOrder: lastOrder + 1,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: "일정이 추가되었습니다",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("일정 생성 실패:", error);

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
