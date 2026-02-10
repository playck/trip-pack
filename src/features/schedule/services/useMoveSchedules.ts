import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { moveSchedulesToDay } from "./api";

interface UseMoveSchedulesOptions {
  onSuccess?: () => void;
}

export const useMoveSchedules = (
  tripId: string,
  tripStartDate: string,
  options?: UseMoveSchedulesOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { scheduleIds: string[]; targetDayNumber: number }) =>
      moveSchedulesToDay({ ...params, tripId, tripStartDate }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: `${variables.scheduleIds.length}개의 일정이 ${variables.targetDayNumber}일차로 이동되었습니다`,
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "일정 이동 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
};
