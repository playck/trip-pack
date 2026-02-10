import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateScheduleOrder } from "./api";

interface UpdateOrderParams {
  updates: Array<{ id: string; visitOrder: number }>;
}

interface UseUpdateScheduleOrderOptions {
  onSuccess?: () => void;
}

export const useUpdateScheduleOrder = (
  tripId: string,
  options?: UseUpdateScheduleOrderOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updates }: UpdateOrderParams) =>
      updateScheduleOrder(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: "일정 순서가 저장되었습니다",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "순서 저장 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
};
