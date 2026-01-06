import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateTripDates } from "./api";

interface UseUpdateTripDatesParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateTripDates(
  tripId: string,
  callback?: UseUpdateTripDatesParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
    }: {
      startDate: string;
      endDate: string;
    }) => updateTripDates(tripId, startDate, endDate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripInfo", tripId],
      });

      if (callback?.onSuccess) {
        callback.onSuccess();
      } else {
        toaster.create({
          title: "여행 기간이 수정되었습니다",
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
