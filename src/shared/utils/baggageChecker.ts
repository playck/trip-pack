import {
  BAGGAGE_POLICY_DATA,
  type CabinCheckItem,
} from "../data/baggagePolicyData";

export interface BaggageCheckResult {
  item: CabinCheckItem;
  matchedKeyword: string;
}

const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();

// 1글자 키워드는 단어 끝에서만 매칭한다 — 한국어 합성어는 핵심 명사가 뒤에 와서
// 식칼·감기약은 맞고, 칼슘·활명수·총무처럼 앞에 붙은 경우는 다른 말이다.
const endsSomeWord = (itemName: string, keyword: string) =>
  itemName
    .toLowerCase()
    .split(/[^가-힣a-z0-9]+/)
    .some((word) => word.endsWith(keyword.toLowerCase()));

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
      const isMatch =
        keyword.length === 1
          ? endsSomeWord(itemName, keyword)
          : query.includes(normalize(keyword));
      if (isMatch && keyword.length > matchedKeyword.length) {
        matchedKeyword = keyword;
      }
    }
    if (matchedKeyword) results.push({ item, matchedKeyword });
  }

  // 매칭 키워드가 긴 순서로 정렬 (동률이면 데이터 순서 유지)
  return results.sort(
    (a, b) => b.matchedKeyword.length - a.matchedKeyword.length,
  );
};

/**
 * 가장 정확도가 높은 규정 1건을 반환합니다. (체크리스트 아이템 매칭용)
 * @returns 매칭된 규정 정보 또는 null
 */
export const checkBaggageRule = (itemName: string): BaggageCheckResult | null =>
  checkBaggageRules(itemName)[0] ?? null;

const ALL_KEYWORDS = [
  ...new Set(BAGGAGE_POLICY_DATA.flatMap((item) => item.keywords)),
];

/**
 * 입력 중 자동완성용 키워드 후보. 입력값을 포함하는 키워드(완전 일치 제외)를
 * 입력값으로 시작하는 것 우선으로 최대 limit개 반환.
 */
export const suggestBaggageKeywords = (query: string, limit = 4): string[] => {
  const q = normalize(query);
  if (!q) return [];

  const matched = ALL_KEYWORDS.filter((keyword) => {
    const k = normalize(keyword);
    return k !== q && k.includes(q);
  });
  const startsWith = (keyword: string) => normalize(keyword).startsWith(q);
  return [
    ...matched.filter(startsWith),
    ...matched.filter((keyword) => !startsWith(keyword)),
  ].slice(0, limit);
};
