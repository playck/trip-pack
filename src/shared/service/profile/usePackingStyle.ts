import { useQuery } from "@tanstack/react-query";
import type { PackingStyle } from "@/shared/data/checkList";
import { getMyPackingStyle } from "./api";

/** 유저별로 캐시를 분리한다(계정 전환 시 다른 사람의 설정이 새지 않도록). */
export const packingStyleQueryKey = (userId: string | undefined) =>
  ["profile", "packingStyle", userId] as const;

interface UsePackingStyleReturn {
  /** `null` = 아직 안 물어봄 → 마법사에 질문 단계를 띄운다 */
  packingStyle: PackingStyle | null;
  /** 체크리스트 생성에 넘길 값. 미확정이면 현재 동작과 같은 `full`. */
  effectiveStyle: PackingStyle;
  isLoading: boolean;
}

/**
 * 내 짐 스타일. [[caching-cost-strategy]] 를 따라 staleTime 5분 + persist.
 * 값을 바꾸면 useUpdatePackingStyle 이 이 키를 invalidate 한다.
 */
export function usePackingStyle(
  userId: string | undefined
): UsePackingStyleReturn {
  const { data, isLoading } = useQuery({
    queryKey: packingStyleQueryKey(userId),
    queryFn: () => getMyPackingStyle(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
  });

  return {
    packingStyle: data ?? null,
    effectiveStyle: data ?? "full",
    isLoading,
  };
}
