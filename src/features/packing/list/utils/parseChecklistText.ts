/**
 * 텍스트에서 체크리스트 카테고리·아이템을 파싱.
 *
 * 지원 패턴:
 * 1) 카테고리 구분형:
 *    [의류]          또는    ## 의류         또는    의류:
 *    - 반팔                  - 반팔                  - 반팔
 *    - 바지                  - 바지                  - 바지
 *
 * 2) 단순 목록형 (카테고리 없이 아이템만):
 *    - 여권
 *    - 충전기
 *    → 키워드 기반으로 자동 분류
 *
 * 아이템 접두사: - · • * ✓ ✔ ☐ ☑ □ ■ ▪ 또는 숫자. 숫자)
 * 수량/메모: 괄호 안 텍스트 → notes 필드
 */

import { dedupWithinCategories } from "./dedupChecklistItems";

const ITEM_PREFIX = /^[\s]*(?:[-·•*✓✔☐☑□■▪]|\d+[.)]\s*)\s*/;
const CATEGORY_BRACKET = /^\[(.+)\]\s*$/;
const CATEGORY_HASH = /^#{1,3}\s+(.+)$/;
const CATEGORY_COLON = /^([^-·•*✓✔☐☑□■▪\d\s].{0,14})[:：]\s*$/;
const NOTE_PAREN = /[（(](.+?)[)）]\s*$/;
const QUANTITY_SUFFIX =
  /\s+(\d+\s*(?:개|벌|켤레|장|병|통|팩|세트|박스|쌍|EA))\s*$/i;

export interface ParsedItem {
  name: string;
  notes?: string;
}

export interface ParsedCategory {
  categoryName: string;
  items: ParsedItem[];
}

function isBlankOrSeparator(line: string): boolean {
  const trimmed = line.trim();
  return trimmed === "" || /^[-=_·.]{3,}$/.test(trimmed);
}

function isItemLine(line: string): boolean {
  return ITEM_PREFIX.test(line);
}

function parseCategoryHeader(line: string): string | null {
  const trimmed = line.trim();
  const bracket = trimmed.match(CATEGORY_BRACKET);
  const hash = trimmed.match(CATEGORY_HASH);
  const colon = trimmed.match(CATEGORY_COLON);
  const name = (bracket?.[1] ?? hash?.[1] ?? colon?.[1] ?? "").trim();
  return name.length > 0 ? name : null;
}

function parseItemLine(line: string): ParsedItem | null {
  let text = line.replace(ITEM_PREFIX, "").trim();
  if (!text) return null;

  let notes: string | undefined;

  const parenMatch = text.match(NOTE_PAREN);
  if (parenMatch) {
    notes = parenMatch[1].trim();
    text = text.replace(NOTE_PAREN, "").trim();
  }

  if (!notes) {
    const qtyMatch = text.match(QUANTITY_SUFFIX);
    if (qtyMatch) {
      notes = qtyMatch[1].trim();
      text = text.replace(QUANTITY_SUFFIX, "").trim();
    }
  }

  if (!text) return null;
  return notes ? { name: text, notes } : { name: text };
}

const DEFAULT_CATEGORY = "기타용품";

// 키워드 → 카테고리 매핑 (부분 문자열 매칭, 카테고리 내 긴 키워드 우선)
const KEYWORD_CATEGORY_MAP: [string, string[]][] = [
  [
    "전자제품",
    [
      "보조배터리",
      "메모리카드",
      "셀카봉",
      "삼각대",
      "충전기",
      "충전",
      "케이블",
      "어댑터",
      "플러그",
      "카메라",
      "이어폰",
      "헤드폰",
      "헤드셋",
      "노트북",
      "태블릿",
      "아이패드",
      "스피커",
      "USB",
      "SD카드",
      "배터리",
      "드라이기",
      "고데기",
    ],
  ],
  [
    "의류",
    [
      "수면안대",
      "운동화",
      "슬리퍼",
      "샌들",
      "티셔츠",
      "반팔",
      "긴팔",
      "바지",
      "반바지",
      "잠옷",
      "속옷",
      "양말",
      "자켓",
      "코트",
      "점퍼",
      "패딩",
      "원피스",
      "치마",
      "셔츠",
      "모자",
      "신발",
      "겉옷",
      "상의",
      "하의",
      "조끼",
      "후드",
      "맨투맨",
      "니트",
      "청바지",
      "래쉬가드",
    ],
  ],
  [
    "세면용품",
    [
      "클렌징",
      "바디워시",
      "트리트먼트",
      "면도기",
      "칫솔",
      "치약",
      "샴푸",
      "린스",
      "수건",
      "타월",
      "비누",
      "면봉",
      "화장솜",
      "치실",
      "빗",
    ],
  ],
  [
    "화장품",
    [
      "마스크팩",
      "파운데이션",
      "선크림",
      "자외선차단",
      "로션",
      "스킨",
      "토너",
      "에센스",
      "크림",
      "립밤",
      "립스틱",
      "화장품",
      "메이크업",
      "쿠션",
      "컨실러",
      "아이라이너",
      "마스카라",
    ],
  ],
  [
    "상비약",
    [
      "타이레놀",
      "진통제",
      "소화제",
      "지사제",
      "반창고",
      "해열제",
      "감기약",
      "멀미약",
      "모기퇴치",
      "알로에",
      "소독",
      "밴드",
      "연고",
      "처방약",
      "상비약",
      "마스크",
      "안약",
      "파스",
      "붕대",
    ],
  ],
  [
    "기타용품",
    [
      "지퍼백",
      "압축팩",
      "목베개",
      "물티슈",
      "자물쇠",
      "비닐봉투",
      "우산",
      "필기구",
      "메모장",
      "세탁망",
    ],
  ],
];

function classifyItem(itemName: string): string {
  const lower = itemName.toLowerCase();
  for (const [category, keywords] of KEYWORD_CATEGORY_MAP) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  return DEFAULT_CATEGORY;
}

function classifyItemsIntoCategories(items: ParsedItem[]): ParsedCategory[] {
  const categoryMap = new Map<string, ParsedItem[]>();

  for (const item of items) {
    const category = classifyItem(item.name);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(item);
  }

  return Array.from(categoryMap.entries()).map(([categoryName, catItems]) => ({
    categoryName,
    items: catItems.map((item) => ({
      name: item.name,
      ...(item.notes ? { notes: item.notes } : {}),
    })),
  }));
}

export function parseChecklistFromText(rawText: string): ParsedCategory[] {
  const lines = rawText.split(/\r?\n/);
  const categories: ParsedCategory[] = [];
  let currentCategory: string | null = null;
  let currentItems: ParsedItem[] = [];

  const flushCategory = () => {
    if (currentItems.length > 0) {
      const name = currentCategory?.trim();
      categories.push({
        categoryName: name && name.length > 0 ? name : DEFAULT_CATEGORY,
        items: currentItems.map((item) => ({
          name: item.name,
          ...(item.notes ? { notes: item.notes } : {}),
        })),
      });
    }
    currentItems = [];
  };

  const hasCategoryHeaders = lines.some(
    (line) => !isBlankOrSeparator(line) && parseCategoryHeader(line) !== null,
  );

  for (const line of lines) {
    if (isBlankOrSeparator(line)) continue;

    if (hasCategoryHeaders) {
      const categoryName = parseCategoryHeader(line);
      if (categoryName) {
        flushCategory();
        currentCategory = categoryName;
        continue;
      }
    }

    if (isItemLine(line)) {
      const item = parseItemLine(line);
      if (item) currentItems.push(item);
    } else if (!hasCategoryHeaders) {
      const trimmed = line.trim();
      if (trimmed.length > 0 && trimmed.length <= 30) {
        const item = parseItemLine(`- ${trimmed}`);
        if (item) currentItems.push(item);
      }
    }
  }

  flushCategory();

  // 카테고리 헤더가 없는 단순 목록이면 키워드 기반 자동 분류
  if (
    !hasCategoryHeaders &&
    categories.length === 1 &&
    categories[0].categoryName === DEFAULT_CATEGORY
  ) {
    const allItems: ParsedItem[] = categories[0].items.map((item) => ({
      name: item.name,
      ...(item.notes ? { notes: item.notes } : {}),
    }));
    return dedupWithinCategories(classifyItemsIntoCategories(allItems));
  }

  return dedupWithinCategories(categories);
}
