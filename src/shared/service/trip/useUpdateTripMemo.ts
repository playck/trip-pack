import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateTripMemo } from "./api";

interface UseUpdateTripMemoParams {
  onSuccess?: () => void;
}

export function useUpdateTripMemo(
  tripId: string,
  callback?: UseUpdateTripMemoParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memo: string | null) => updateTripMemo(tripId, memo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripInfo", tripId],
      });

      toaster.create({
        title: "메모가 저장되었습니다",
        type: "success",
        duration: 2000,
      });

      callback?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "메모 저장 실패",
        description: error.message,
        type: "error",
        duration: 2000,
      });
    },
  });
}
