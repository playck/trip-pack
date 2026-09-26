import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { toaster } from "@/shared/components/ui/toaster";
import type { PackingStyle } from "@/shared/data/checkList";

import { packingStyleAtom } from "@/shared/store/packingStyleStore";

import { updateMyPackingStyle } from "./api";
import { packingStyleQueryKey } from "./usePackingStyle";

export function useUpdatePackingStyle(userId: string | undefined) {
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
