import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import {
  scheduleTripNotification,
  cancelTripNotification,
} from "@/shared/utils/nativeMessage";
import {
  updateTripDatesWithSchedules,
  getSchedulesOutOfRange,
  countExpensesOutOfRange,
} from "./api";

interface UseUpdateTripDatesParams {
  tripTitle?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface MutationParams {
  startDate: string;
  endDate: string;
  deleteOutOfRangeSchedules?: boolean;
}

export function useUpdateTripDates(
  tripId: string,
  callback?: UseUpdateTripDatesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
      deleteOutOfRangeSchedules = false,
    }: MutationParams) =>
      updateTripDatesWithSchedules({
        tripId,
        startDate,
        endDate,
        deleteOutOfRangeSchedules,
      }),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripInfo", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripSchedules", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripFlights", tripId],
      });

      cancelTripNotification({ tripId });
      if (callback?.tripTitle) {
        scheduleTripNotification({
          tripId,
          tripTitle: callback.tripTitle,
          startDate: variables.startDate,
        });
      }

      if (callback?.onSuccess) {
        callback.onSuccess();
      } else {
        const message =
          result.deletedScheduleCount > 0
            ? `여행 기간이 수정되었습니다 (${result.deletedScheduleCount}개 일정 삭제됨)`
            : "여행 기간이 수정되었습니다";

        toaster.create({
          title: message,
          type: "success",
          duration: 2000,
        });
      }
    },
    onError: (error: Error) => {
      if (callback?.onError) {
        callback.onError(error);
      } else {
        toaster.create({
          title: "여행 기간 수정 실패",
          description: error.message,
          type: "error",
          duration: 2000,
        });
      }
    },
  });
}

// 기간 축소 시 삭제될 일정·경비 개수 조회 훅
// 삭제 직전 경고용이라 캐시를 믿지 않고 매번 새로 센다(staleTime 0)
export function useOutOfRangeCounts(
  tripId: string,
  maxDayNumber: number,
  enabled = true,
) {
  return useQuery({
    queryKey: ["outOfRangeCounts", tripId, maxDayNumber],
    queryFn: async () => {
      const schedules = await getSchedulesOutOfRange(tripId, maxDayNumber);
      const expenses = await countExpensesOutOfRange(
        tripId,
        maxDayNumber,
        schedules.map((s) => s.id),
      );
      return { schedules: schedules.length, expenses };
    },
    enabled: enabled && !!tripId && maxDayNumber > 0,
    staleTime: 0,
  });
}
