import {
  BAGGAGE_POLICY_DATA,
  type CabinCheckItem,
} from "../data/baggagePolicyData";

export interface BaggageCheckResult {
  item: CabinCheckItem;
  matchedKeyword: string;
}

/**
 * 입력된 아이템 이름으로 기내/위탁 수하물 규정을 검색합니다.
 * @param itemName 사용자가 입력한 아이템 이름 (예: "김밥", "보조배터리")
 * @returns 매칭된 규정 정보 또는 null
 */
export const checkBaggageRule = (
  itemName: string
): BaggageCheckResult | null => {
  if (!itemName) return null;

  const query = itemName.trim();

  // 키워드 매칭
  const matchedItem = BAGGAGE_POLICY_DATA.find((item) =>
    item.keywords.some((keyword) => query.includes(keyword))
  );

  if (matchedItem) {
    // 매칭된 키워드 찾기
    const matchedKeyword =
      matchedItem.keywords.find((keyword) => query.includes(keyword)) || query;
    return { item: matchedItem, matchedKeyword };
  }

  return null;
};
