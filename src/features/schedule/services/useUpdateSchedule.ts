import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateSchedule } from "./api";
import type { UpdateScheduleParams } from "../types";

export const useUpdateSchedule = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateScheduleParams) => updateSchedule(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: "일정이 수정되었습니다",
        type: "success",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "일정 수정 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
};
