import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteTrip } from "../service/api";

interface UseDeleteTripParams {
  onSuccess?: (tripId: string) => void;
  onError?: (error: Error) => void;
}

export function useDeleteTrip(callback?: UseDeleteTripParams) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({
        queryKey: ["tripList"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trips", tripId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tripChecklist", tripId],
      });

      if (callback?.onSuccess) {
        callback.onSuccess(tripId);
      } else {
        toaster.create({
          title: "여행이 삭제되었습니다",
          description: "여행과 관련된 모든 데이터가 삭제되었습니다",
          type: "success",
          duration: 3000,
        });
        navigate({ to: "/" });
      }
    },
    onError: (error: Error) => {
      if (callback?.onError) {
        callback.onError(error);
      } else {
        toaster.create({
          title: "여행 삭제 실패",
          description: error.message,
          type: "error",
          duration: 3000,
        });
      }
    },
  });
}
