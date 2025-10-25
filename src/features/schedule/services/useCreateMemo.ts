import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createSchedule, getLastVisitOrder } from "./api";
import { createMemoId } from "../utils/scheduleHelpers";

interface CreateMemoParams {
  tripId: string;
  dayNumber: number;
  scheduleDate: string;
  memoText: string;
}

interface UseCreateMemoOptions {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: Error) => void;
}

export const useCreateMemo = (
  tripId: string,
  options?: UseCreateMemoOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateMemoParams) => {
      const lastOrder = await getLastVisitOrder(
        params.tripId,
        params.dayNumber
      );

      return createSchedule({
        tripId: params.tripId,
        dayNumber: params.dayNumber,
        scheduleDate: params.scheduleDate,
        placeId: createMemoId(),
        placeName: params.memoText,
        visitOrder: lastOrder + 1,
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
      console.error("메모 생성 실패:", error);

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
