import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteBulkSchedules } from "./api";

interface UseBulkDeleteSchedulesOptions {
  onSuccess?: () => void;
}

export const useBulkDeleteSchedules = (
  tripId: string,
  options?: UseBulkDeleteSchedulesOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleIds: string[]) => deleteBulkSchedules(scheduleIds),
    onSuccess: (_, scheduleIds) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: `${scheduleIds.length}개의 일정이 삭제되었습니다`,
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "일정 삭제 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
};
