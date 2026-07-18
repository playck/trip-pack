import {
  BAGGAGE_POLICY_DATA,
  type CabinCheckItem,
} from "../data/baggagePolicyData";

export interface BaggageCheckResult {
  item: CabinCheckItem;
  matchedKeyword: string;
}

const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();

/**
 * 입력된 아이템 이름과 매칭되는 모든 규정을 검색합니다.
 * 더 긴(=더 구체적인) 키워드가 매칭된 항목을 우선 정렬합니다.
 * @param itemName 사용자가 입력한 아이템 이름 (예: "노트북 충전기")
 */
export const checkBaggageRules = (itemName: string): BaggageCheckResult[] => {
  if (!itemName) return [];

  const query = normalize(itemName);
  if (!query) return [];

  const results: BaggageCheckResult[] = [];

  for (const item of BAGGAGE_POLICY_DATA) {
    let matchedKeyword = "";
    for (const keyword of item.keywords) {
      if (
        query.includes(normalize(keyword)) &&
        keyword.length > matchedKeyword.length
      ) {
        matchedKeyword = keyword;
      }
    }
    if (matchedKeyword) results.push({ item, matchedKeyword });
  }

  // 매칭 키워드가 긴 순서로 정렬 (동률이면 데이터 순서 유지)
  return results.sort(
    (a, b) => b.matchedKeyword.length - a.matchedKeyword.length
  );
};

/**
 * 가장 정확도가 높은 규정 1건을 반환합니다. (체크리스트 아이템 매칭용)
 * @returns 매칭된 규정 정보 또는 null
 */
export const checkBaggageRule = (
  itemName: string
): BaggageCheckResult | null => checkBaggageRules(itemName)[0] ?? null;
