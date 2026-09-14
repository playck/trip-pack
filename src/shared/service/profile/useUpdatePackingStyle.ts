import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { toaster } from "@/shared/components/ui/toaster";
import type { PackingStyle } from "@/shared/data/checkList";

import { packingStyleAtom } from "@/shared/store/packingStyleStore";

import { updateMyPackingStyle } from "./api";
import { packingStyleQueryKey } from "./usePackingStyle";

interface UseUpdatePackingStyleOptions {
  onSuccess?: (packingStyle: PackingStyle) => void;
  silent?: boolean;
}

/**
 * 짐 스타일 변경.
 */
export function useUpdatePackingStyle(
  userId: string | undefined,
  options?: UseUpdatePackingStyleOptions,
) {
  const queryClient = useQueryClient();
  const setPackingStyle = useSetAtom(packingStyleAtom);

  return useMutation({
    mutationFn: (packingStyle: PackingStyle) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return updateMyPackingStyle(userId, packingStyle);
    },
    onSuccess: (_, packingStyle) => {
      // 화면 판단의 기준은 로컬이다. DB 성공을 확인한 뒤에 갱신한다.
      setPackingStyle(packingStyle);
      queryClient.setQueryData(packingStyleQueryKey(userId), packingStyle);
      queryClient.invalidateQueries({
        queryKey: packingStyleQueryKey(userId),
      });

      options?.onSuccess?.(packingStyle);

      if (!options?.silent) {
        toaster.create({
          title:
            packingStyle === "minimal"
              ? "다음 여행부터 가볍게 만들어드릴게요"
              : "다음 여행부터 넉넉하게 만들어드릴게요",
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
