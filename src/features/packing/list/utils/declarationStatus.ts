import type { QueryClient } from "@tanstack/react-query";

import {
  ENTRY_DECLARATION_GUIDE_KEY,
  ESSENTIAL_CATEGORY_NAME,
  findEssentialGuide,
} from "@/shared/data/essentialItemGuides";

import { queryKeys } from "../hooks/useTripChecklist";
import type { CategoryWithItems } from "../../type";

/**
 * 캐시된 체크리스트만으로 입국신고 아이템의 체크 여부를 판단한다 (fetch 트리거 없음).
 * 캐시가 없거나(아직 안 열어본 여행) 아이템이 없으면(기능 배포 전 여행) false를
 * 반환한다 — 확실히 체크한 경우에만 배지를 숨기는 안전한 방향.
 */
export function isDeclarationCheckedInCache(
  queryClient: QueryClient,
  tripId: string,
): boolean {
  const categories = queryClient.getQueryData<CategoryWithItems[]>(
    queryKeys.tripChecklist(tripId),
  );
  const essential = categories?.find(
    (category) => category.name === ESSENTIAL_CATEGORY_NAME,
  );
  const declarationItem = essential?.items?.find(
    (item) =>
      findEssentialGuide(item.name)?.key === ENTRY_DECLARATION_GUIDE_KEY,
  );
  return !!declarationItem?.is_checked;
}
