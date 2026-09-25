import { useMemo } from "react";

import {
  getEntryDeclaration,
  isDeclarationWindowOpen,
} from "@/shared/data/entryDeclarations";
import {
  ENTRY_DECLARATION_GUIDE_KEY,
  ESSENTIAL_CATEGORY_NAME,
  findEssentialGuide,
} from "@/shared/data/essentialItemGuides";

import { getTripCountdown } from "../utils/tripCountdown";
import { useTripChecklist } from "./useTripChecklist";

interface EntryDeclarationStatus {
  declaration: ReturnType<typeof getEntryDeclaration>;
  /** 작성 창이 열렸는데 아직 안 한 상태. 홈 여행 카드 배지와 같은 조건이다 */
  isDeclarationDue: boolean;
}

/**
 * 이 여행의 입국신고를 지금 해야 하는지.
 *
 * 짐 목록에서 입국신고를 알리는 자리는 비자 리드아웃 행 하나다. 별도 배너를 두면
 * 같은 사실이 홈 카드 배지 · 배너 · 이 배지로 세 번 반복돼 배너를 없앴다.
 * 기한과 공식 링크는 비자 시트(`EntryInfoSheet`)의 입국신고 블록이 맡는다.
 *
 * 추가 조회는 없다 — `useTripChecklist`가 짐 목록과 같은 쿼리 키라 캐시를 공유한다.
 */
export function useEntryDeclarationStatus(
  tripId: string,
  countryCode: string | null | undefined,
  startDate: string,
  endDate: string,
): EntryDeclarationStatus {
  const { categories } = useTripChecklist(tripId);

  const declaration = useMemo(
    () => getEntryDeclaration(countryCode),
    [countryCode],
  );

  // 이름을 바꿔도 찾도록 정확 일치 대신 가이드 매칭으로 판정(가이드 pill과 동일 기준)
  const declarationItem = useMemo(() => {
    if (!declaration) return null;
    const essential = categories.find(
      (category) => category.name === ESSENTIAL_CATEGORY_NAME,
    );
    return (
      essential?.items?.find(
        (item) =>
          findEssentialGuide(item.name)?.key === ENTRY_DECLARATION_GUIDE_KEY,
      ) ?? null
    );
  }, [categories, declaration]);

  // getTripCountdown은 "오늘"에 의존해 메모이제이션 금지 (utils/tripCountdown.ts 주석)
  const { daysUntilTrip, daysUntilTripEnd } = getTripCountdown(
    startDate,
    endDate,
  );

  const isDeclarationDue =
    !!declaration &&
    !!declarationItem &&
    !declarationItem.is_checked &&
    isDeclarationWindowOpen(declaration, daysUntilTrip, daysUntilTripEnd);

  return { declaration, isDeclarationDue };
}
