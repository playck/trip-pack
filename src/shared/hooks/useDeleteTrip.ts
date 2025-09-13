import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "../service/api";

interface UseDeleteTripParams {
  onSuccess?: (tripId: string) => void;
  onError?: (error: Error) => void;
}

export function useDeleteTrip(callback?: UseDeleteTripParams) {
  const queryClient = useQueryClient();

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

      callback?.onSuccess?.(tripId);
    },
    onError: (error: Error) => {
      callback?.onError?.(error);
    },
  });
}
