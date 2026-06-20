// 쿠팡 파트너스 꿀템 매핑 (수동 단축링크 방식)
//
// API 미승인 단계의 MVP: "까먹으면 후회하는 여행 준비물"을 직접 큐레이션해
// 파트너스 단축링크로 연결한다. 패킹 물품명과 매칭되면 인라인 "구매" 라벨 +
// "준비물 쇼핑" 모아보기에 노출된다.
//
// url 은 파트너스에서 수동 생성한 단축링크(link.coupang.com/a/xxxx)다.
// 쿠팡 상품 이미지는 직접 핫링크 금지(정책·깨짐 위험)이므로, 가격과 함께
// 표시하지 않고 물품별 lucide 아이콘으로 대체한다.

import {
  Plug,
  BatteryCharging,
  BedDouble,
  Package,
  Sparkles,
  Pill,
  Bug,
  Fan,
  Flame,
  Umbrella,
  Droplets,
  Camera,
  Cable,
  Eye,
  Backpack,
  CupSoda,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CoupangDeal {
  /** 매칭 키 — 체크리스트 물품명과 정규화 후 대조 */
  itemName: string;
  /** 매칭 보조 키워드 (표기 변형·동의어 흡수) */
  keywords?: string[];
  /** 쿠팡 파트너스 단축링크 */
  url: string;
  /** 모아보기/상세 표시 아이콘 (쿠팡 이미지 대체) */
  icon: LucideIcon;
}

export const COUPANG_DEALS: CoupangDeal[] = [
  {
    itemName: "멀티 어댑터",
    keywords: ["멀티 플러그", "어댑터", "변환 플러그", "멀티탭", "돼지코"],
    url: "https://link.coupang.com/a/eJePTz0mzY",
    icon: Plug,
  },
  {
    itemName: "보조배터리",
    keywords: ["보조 배터리", "파워뱅크", "휴대용 충전기"],
    url: "https://link.coupang.com/a/eJeXaNdovA",
    icon: BatteryCharging,
  },
  {
    itemName: "목베개",
    keywords: ["목 베개", "넥쿠션", "넥필로우", "여행 베개"],
    url: "https://link.coupang.com/a/eJe27AwkWO",
    icon: BedDouble,
  },
  {
    itemName: "의류 압축팩",
    keywords: ["압축팩", "압축 파우치", "여행 파우치"],
    url: "https://link.coupang.com/a/eJfauR5HBk",
    icon: Package,
  },
  {
    itemName: "여행용 세면도구",
    keywords: ["세면도구", "세면 세트", "트래블 키트", "여행 세트", "칫솔"],
    url: "https://link.coupang.com/a/eJfYbvY28a",
    icon: Sparkles,
  },
  {
    itemName: "멀미약",
    keywords: ["멀미약"],
    url: "https://link.coupang.com/a/eJgsdKNS2u",
    icon: Pill,
  },
  {
    itemName: "모기 퇴치제",
    keywords: ["모기", "벌레 퇴치"],
    url: "https://link.coupang.com/a/eJgABjPTl6",
    icon: Bug,
  },
  {
    itemName: "휴대용 선풍기",
    keywords: ["휴대용 선풍기", "선풍기", "손선풍기"],
    url: "https://link.coupang.com/a/eJgN9nTFim",
    icon: Fan,
  },
  {
    itemName: "핫팩",
    keywords: ["핫팩"],
    url: "https://link.coupang.com/a/eJgVPaJfQ4",
    icon: Flame,
  },
  {
    itemName: "우산",
    keywords: ["우산"],
    url: "https://link.coupang.com/a/eJg5RcXdsG",
    icon: Umbrella,
  },
  {
    itemName: "방수팩",
    keywords: ["방수팩", "방수 파우치"],
    url: "https://link.coupang.com/a/eJg789H3LM",
    icon: Droplets,
  },
  {
    itemName: "셀카봉",
    keywords: ["셀카봉", "삼각대"],
    url: "https://link.coupang.com/a/eJhwqUCjGC",
    icon: Camera,
  },
  {
    itemName: "충전 케이블",
    keywords: ["충전 케이블", "충전케이블", "케이블"],
    url: "https://link.coupang.com/a/eJinWrfDbM",
    icon: Cable,
  },
  {
    itemName: "수면안대",
    keywords: ["수면안대", "안대"],
    url: "https://link.coupang.com/a/eJiE8fd49I",
    icon: Eye,
  },
  {
    itemName: "여행용 크로스백",
    keywords: ["크로스백", "미니 배낭", "보조 가방"],
    url: "https://link.coupang.com/a/eJiJgQ6rTg",
    icon: Backpack,
  },
  {
    itemName: "보온 텀블러",
    keywords: ["텀블러"],
    url: "https://link.coupang.com/a/eJiMYPSAP6",
    icon: CupSoda,
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
