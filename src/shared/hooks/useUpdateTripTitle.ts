import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateTripTitle } from "../service/api";

interface UseUpdateTripTitleParams {
  onSuccess?: (newTitle: string) => void;
  onError?: (error: Error) => void;
  setTripTitle?: (title: string) => void;
  setIsEditingTitle?: (editing: boolean) => void;
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

      if (callback?.onSuccess) {
        callback.onSuccess(newTitle);
      } else {
        // 기본 상태 업데이트
        callback?.setTripTitle?.(newTitle);
        callback?.setIsEditingTitle?.(false);

        toaster.create({
          title: "여행명이 수정되었습니다",
          description: `'${newTitle}'로 변경되었습니다`,
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
          title: "여행명 수정 실패",
          description: error.message,
          type: "error",
          duration: 2000,
        });
      }
    },
  });
}
