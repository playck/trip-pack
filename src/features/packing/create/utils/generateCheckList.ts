import {
  ESSENTIAL_ITEMS,
  DOMESTIC_ESSENTIAL_ITEMS,
  ELECTRONICS_ITEMS,
  CLOTHING_ITEMS,
  TOILETRIES_ITEMS,
  COSMETICS_ITEMS,
  EMERGENCY_MED_ITEMS,
  MISC_OPTIONAL_ITEMS,
  BABY_ITEMS,
  PET_TRAVEL_ITEMS,
  SUMMER_ITEMS,
  WINTER_ITEMS,
  RAINY_ITEMS,
} from "@/shared/data/checkList";
import type { PackItem } from "@/shared/data/checkList";
import { getPlugNote } from "@/shared/data/plugStandards";

import type { PackingCreateState } from "../store/packingCreateAtom";
import { getVisaNote, getVisaRule } from "./visaRules";
import { getSeason, isRainySeason, getTripDays } from "./climateRules";
import { TRIP_TYPE_CATEGORY_MAP } from "./tripTypeMap";

export interface GeneratedCheckList {
  categoryName: string;
  items: PackItem[];
}

export function generateCheckList(
  state: PackingCreateState
): GeneratedCheckList[] {
  const result: GeneratedCheckList[] = [];
  const countryCode = state.region?.countryCode ?? "KR";
  const isOverseasTrip = countryCode !== "KR";
  const visaRule = getVisaRule(countryCode, state.region?.id);

  // ── 1. 필수 준비물 ──
  if (isOverseasTrip) {
    const essentialItems = [...ESSENTIAL_ITEMS];
    const passportIndex = essentialItems.findIndex(
      (item) => item.name === "여권"
    );
    const insertAt = passportIndex >= 0 ? passportIndex + 1 : 0;
    essentialItems.splice(insertAt, 0, {
      name: visaRule.required ? "비자" : "비자 정보 확인",
      required: visaRule.required,
      notes: getVisaNote(visaRule),
    });
    result.push({ categoryName: "필수 준비물", items: essentialItems });
  } else {
    result.push({
      categoryName: "필수 준비물",
      items: DOMESTIC_ESSENTIAL_ITEMS,
    });
  }

  // ── 2. 기본 카테고리 ──
  const electronicsItems = isOverseasTrip
    ? ELECTRONICS_ITEMS.map((item) => {
        if (item.name === "멀티 플러그(국가별 어댑터)") {
          const plugNote = getPlugNote(countryCode);
          return plugNote ? { ...item, notes: plugNote } : item;
        }
        return item;
      })
    : ELECTRONICS_ITEMS;

  result.push(
    { categoryName: "전자제품", items: electronicsItems },
    { categoryName: "의류", items: CLOTHING_ITEMS },
    { categoryName: "세면용품", items: TOILETRIES_ITEMS },
    { categoryName: "화장품", items: COSMETICS_ITEMS },
    { categoryName: "상비약", items: EMERGENCY_MED_ITEMS },
    { categoryName: "기타용품", items: MISC_OPTIONAL_ITEMS }
  );

  // ── 3. 계절별 아이템 ──
  if (state.dates.startDate) {
    const month = state.dates.startDate.getMonth();
    const season = getSeason(month, countryCode);
    const tripDays = state.dates.endDate
      ? getTripDays(state.dates.startDate, state.dates.endDate)
      : 1;

    if (season === "summer") {
      result.push({ categoryName: "여름 준비물", items: SUMMER_ITEMS });
    }

    if (season === "winter") {
      result.push({ categoryName: "겨울 준비물", items: WINTER_ITEMS });
    }

    if (isRainySeason(month, countryCode)) {
      result.push({ categoryName: "우기/장마 대비", items: RAINY_ITEMS });
    }

    if (tripDays > 1) {
      const clothingCategory = result.find((c) => c.categoryName === "의류");
      if (clothingCategory) {
        clothingCategory.items = clothingCategory.items.map((item) => {
          if (["속옷", "양말"].includes(item.name)) {
            return {
              ...item,
              notes: `${tripDays - 1}박이면 ${tripDays}벌 이상 권장`,
            };
          }
          return item;
        });
      }
    }
  }

  // ── 4. 동행자 유형별 카테고리 ──
  if (state.companionTypes.includes("아기")) {
    result.push({ categoryName: "유아용품", items: BABY_ITEMS });
  }

  if (state.companionTypes.includes("반려동물")) {
    result.push({ categoryName: "반려동물용품", items: PET_TRAVEL_ITEMS });
  }

  // ── 5. 여행 유형별 카테고리 (미식은 해외일 때만) ──
  for (const tripType of state.tripTypes) {
    if (tripType === "미식" && !isOverseasTrip) continue;

    const mapping = TRIP_TYPE_CATEGORY_MAP[tripType];
    if (mapping) {
      result.push({
        categoryName: mapping.categoryName,
        items: mapping.items,
      });
    }
  }

  // 카테고리 간 중복 아이템 제거 (먼저 등장한 카테고리 우선)
  const usedItemNames = new Set<string>();
  for (const category of result) {
    category.items = category.items.filter((item) => {
      if (usedItemNames.has(item.name)) return false;
      usedItemNames.add(item.name);
      return true;
    });
  }

  return result;
}
