import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteSchedule } from "./api";

interface UseDeleteScheduleOptions {
  onSuccess?: () => void;
}

export function useDeleteSchedule(
  tripId: string,
  options?: UseDeleteScheduleOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: "일정이 삭제되었습니다",
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
}
