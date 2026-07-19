import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createSchedule } from "./api";
import { createMemoId } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";

interface CreateMemoParams {
  tripId: string;
  dayNumber: number;
  scheduleDate: string;
  memoText: string;
  iconKey?: string;
}

interface UseCreateMemoOptions {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: Error) => void;
}

export const useCreateMemo = (
  tripId: string,
  options?: UseCreateMemoOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateMemoParams) => {
      const cached =
        queryClient.getQueryData<Schedule[]>(["tripSchedules", tripId]) ?? [];
      const lastOrder = cached
        .filter((s) => s.day_number === params.dayNumber)
        .reduce((max, s) => Math.max(max, s.visit_order), 0);

      return createSchedule({
        tripId: params.tripId,
        dayNumber: params.dayNumber,
        scheduleDate: params.scheduleDate,
        placeId: createMemoId(),
        placeName: params.memoText,
        visitOrder: lastOrder + 1,
        category: params.iconKey,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });

      toaster.create({
        title: "메모가 추가되었습니다",
        type: "success",
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toaster.create({
        title: "메모 추가 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
};
