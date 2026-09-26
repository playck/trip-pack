import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import type { PackingStyle } from "@/shared/data/checkList";
import { packingStyleAtom } from "@/shared/store/packingStyleStore";

import { getMyPackingStyle } from "./api";

/** 계정 전환 시 다른 사람의 설정이 새지 않도록 유저별로 분리. */
export const packingStyleQueryKey = (userId: string | undefined) =>
  ["profile", "packingStyle", userId] as const;

interface UsePackingStyleReturn {
  packingStyle: PackingStyle | null;
  /** 체크리스트 생성에 넘길 값. 미확정이면 `full`. */
  effectiveStyle: PackingStyle;
}

/**
 * **값은 로컬에서 동기로 읽는다** — 대기 상태가 없어 호출부가 로딩을 다룰 필요가 없다.
 * DB 조회는 로컬이 비었을 때(재설치·기기 변경) 채워 넣는 보조 역할.
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
