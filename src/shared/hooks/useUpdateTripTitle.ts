import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTripTitle } from "../service/api";

interface UseUpdateTripTitleParams {
  onSuccess?: (newTitle: string) => void;
  onError?: (error: Error) => void;
}

export function useUpdateTripTitle(
  tripId: string,
  callback?: UseUpdateTripTitleParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTitle: string) => updateTripTitle(tripId, newTitle),
    onSuccess: (_, newTitle) => {
      queryClient.invalidateQueries({
        queryKey: ["trips", tripId],
      });

      callback?.onSuccess?.(newTitle);
    },
    onError: (error: Error) => {
      callback?.onError?.(error);
    },
  });
}
