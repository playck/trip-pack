import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toaster } from "@/shared/components/ui/toaster";
import type { PackingStyle } from "@/shared/data/checkList";

import { updateMyPackingStyle } from "./api";
import { packingStyleQueryKey } from "./usePackingStyle";

interface UseUpdatePackingStyleOptions {
  onSuccess?: (packingStyle: PackingStyle) => void;
  /** 토스트를 띄우지 않는다(마법사처럼 다음 화면으로 바로 넘어가는 경우). */
  silent?: boolean;
}

/**
 * 짐 스타일 변경.
 *
 * 성공 시 캐시를 **반드시** invalidate 한다. staleTime 이 5분이라
 * 그냥 두면 마이페이지에서 바꾼 직후 여행을 만들 때 최대 5분간 이전 값이 쓰인다.
 */
export function useUpdatePackingStyle(
  userId: string | undefined,
  options?: UseUpdatePackingStyleOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packingStyle: PackingStyle) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return updateMyPackingStyle(userId, packingStyle);
    },
    onSuccess: (_, packingStyle) => {
      queryClient.setQueryData(packingStyleQueryKey(userId), packingStyle);
      queryClient.invalidateQueries({
        queryKey: packingStyleQueryKey(userId),
      });

      options?.onSuccess?.(packingStyle);

      if (!options?.silent) {
        toaster.create({
          title:
            packingStyle === "minimal"
              ? "다음 여행부터 간소한 목록으로 만들어드릴게요"
              : "다음 여행부터 전체 목록으로 만들어드릴게요",
          type: "success",
          duration: 2000,
        });
      }
    },
    onError: (error: Error) => {
      toaster.create({
        title: "짐 스타일 저장 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}
