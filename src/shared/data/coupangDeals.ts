// 쿠팡 파트너스 꿀템 매핑 (수동 단축링크 방식)
//
// API 미승인 단계의 MVP: "까먹으면 후회하는 여행 준비물"을 직접 큐레이션해
// 파트너스 단축링크로 연결한다. 패킹 물품명과 매칭되면 인라인 "구매" 라벨 +
// "준비물 쇼핑" 모아보기에 노출된다.
//
// ⚠️ url 은 현재 추적이 없는 검색 URL(placeholder)이다.
//    파트너스에서 생성한 단축링크(https://link.coupang.com/a/xxxx)로 교체해야
//    수수료가 집계된다.

export interface CoupangDeal {
  /** 매칭 키 — 체크리스트 물품명과 정규화 후 대조 */
  itemName: string;
  /** 매칭 보조 키워드 (표기 변형·동의어 흡수) */
  keywords?: string[];
  /** 쿠팡 파트너스 단축링크 (현재는 검색 URL placeholder) */
  url: string;
  /** 모아보기/상세 표시용 (선택) */
  productName?: string;
  price?: number;
  imageUrl?: string;
}

const searchUrl = (q: string) =>
  `https://www.coupang.com/np/search?q=${encodeURIComponent(q)}`;

export const COUPANG_DEALS: CoupangDeal[] = [
  {
    itemName: "멀티 어댑터",
    keywords: ["멀티 플러그", "어댑터", "변환 플러그", "멀티탭", "돼지코"],
    url: searchUrl("여행용 멀티 어댑터"),
    productName: "유니버설 멀티 어댑터 USB-C",
    price: 12900,
  },
  {
    itemName: "보조배터리",
    keywords: ["보조 배터리", "파워뱅크", "휴대용 충전기"],
    url: searchUrl("보조배터리 대용량"),
    productName: "10000mAh 보조배터리",
    price: 19900,
  },
  {
    itemName: "목베개",
    keywords: ["목 베개", "넥쿠션", "넥필로우", "여행 베개"],
    url: searchUrl("여행용 목베개"),
    productName: "메모리폼 여행 목베개",
    price: 9900,
  },
  {
    itemName: "의류 압축팩",
    keywords: ["압축팩", "압축 파우치", "여행 파우치"],
    url: searchUrl("여행 압축팩"),
    productName: "여행용 의류 압축팩 세트",
    price: 8900,
  },
  {
    itemName: "여행용 세면도구",
    keywords: ["세면도구", "세면 세트", "트래블 키트", "여행 세트", "칫솔"],
    url: searchUrl("여행용 세면도구 세트"),
    productName: "휴대용 세면도구 파우치",
    price: 11900,
  },

  // ── 카테고리 확장 큐레이션 ──
  // url·productName·price 는 모두 placeholder. 파트너스 단축링크 + 실제 상품으로 교체 필요.
  {
    itemName: "물티슈",
    keywords: ["물티슈"],
    url: searchUrl("여행용 휴대용 물티슈"),
    productName: "휴대용 물티슈 소형 10팩",
    price: 5900,
  },
  {
    itemName: "마스크",
    keywords: ["마스크"],
    url: searchUrl("일회용 마스크 개별포장"),
    productName: "개별포장 일회용 마스크",
    price: 7900,
  },
  {
    itemName: "멀미약",
    keywords: ["멀미약"],
    url: searchUrl("멀미약 패치"),
    productName: "여행용 멀미약",
    price: 4900,
  },
  {
    itemName: "모기 퇴치제",
    keywords: ["모기", "벌레 퇴치"],
    url: searchUrl("휴대용 모기 퇴치제"),
    productName: "휴대용 모기 퇴치 스프레이",
    price: 6900,
  },
  {
    itemName: "휴대용 선풍기",
    keywords: ["휴대용 선풍기", "선풍기", "손선풍기"],
    url: searchUrl("휴대용 미니 선풍기"),
    productName: "USB 충전식 휴대용 선풍기",
    price: 12900,
  },
  {
    itemName: "핫팩",
    keywords: ["핫팩"],
    url: searchUrl("휴대용 핫팩 손난로"),
    productName: "흔드는 손난로 핫팩 10개입",
    price: 5900,
  },
  {
    itemName: "우산",
    keywords: ["우산"],
    url: searchUrl("초경량 접이식 우산"),
    productName: "초경량 접이식 우산",
    price: 13900,
  },
  {
    itemName: "방수팩",
    keywords: ["방수팩", "방수 파우치"],
    url: searchUrl("휴대폰 방수팩"),
    productName: "스마트폰 방수팩",
    price: 4900,
  },
  {
    itemName: "헤드랜턴",
    keywords: ["헤드랜턴", "손전등", "랜턴"],
    url: searchUrl("LED 헤드랜턴 충전식"),
    productName: "충전식 LED 헤드랜턴",
    price: 14900,
  },
  {
    itemName: "셀카봉",
    keywords: ["셀카봉", "삼각대"],
    url: searchUrl("블루투스 셀카봉 삼각대"),
    productName: "블루투스 셀카봉 겸 삼각대",
    price: 15900,
  },
];

const normalize = (s: string): string =>
  s.toLowerCase().replace(/[\s()/·,~-]/g, "");

/** 물품명으로 큐레이션된 꿀템을 찾는다. 없으면 null. */
export function findCoupangDeal(itemName: string): CoupangDeal | null {
  const n = normalize(itemName);
  if (!n) return null;

  for (const deal of COUPANG_DEALS) {
    const dn = normalize(deal.itemName);
    // 정확 일치 또는 물품명이 딜 이름을 포함(연관 추천은 살린다).
    // 딜 이름이 물품명을 포함하는 dn.includes(n)은 "팩"→"압축팩" 같은
    // 짧은 글자 우연 매칭을 유발하므로 제외. 정당한 짧은 물품명은 keywords로 커버.
    if (n === dn || n.includes(dn)) return deal;
    if (deal.keywords?.some((k) => n.includes(normalize(k)))) return deal;
  }
  return null;
}
