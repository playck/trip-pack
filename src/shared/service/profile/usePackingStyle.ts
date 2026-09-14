import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import type { PackingStyle } from "@/shared/data/checkList";
import { packingStyleAtom } from "@/shared/store/packingStyleStore";

import { getMyPackingStyle } from "./api";

/** 유저별로 캐시를 분리한다(계정 전환 시 다른 사람의 설정이 새지 않도록). */
export const packingStyleQueryKey = (userId: string | undefined) =>
  ["profile", "packingStyle", userId] as const;

interface UsePackingStyleReturn {
  packingStyle: PackingStyle | null;
  /** 체크리스트 생성에 넘길 값. 미확정이면 현재 동작과 같은 `full`. */
  effectiveStyle: PackingStyle;
}

/**
 * 내 짐 스타일.
 *
 * **값은 로컬(`packingStyleAtom`)에서 동기로 읽는다.** 대기 상태가 없으므로
 * 호출부는 로딩을 다룰 필요가 없다 — 첫 렌더링부터 확정된 값이 온다.
 *
 * DB 조회는 보조 역할이다. 로컬이 비어 있을 때만(재설치·기기 변경) 그 값을 채워 넣는다.
 *
 * [[caching-cost-strategy]] 를 따라 staleTime 5분 + persist.
 */
export function usePackingStyle(
  userId: string | undefined,
): UsePackingStyleReturn {
  const [packingStyle, setPackingStyle] = useAtom(packingStyleAtom);

  const { data } = useQuery({
    queryKey: packingStyleQueryKey(userId),
    queryFn: () => getMyPackingStyle(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
  });

  useEffect(() => {
    if (!data || packingStyle !== null) return;
    setPackingStyle(data);
  }, [data, packingStyle, setPackingStyle]);

  return {
    packingStyle,
    effectiveStyle: packingStyle ?? "full",
  };
}
