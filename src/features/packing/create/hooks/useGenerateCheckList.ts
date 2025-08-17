import {
  ESSENTIAL_ITEMS,
  ELECTRONICS_ITEMS,
  CLOTHING_ITEMS,
  TOILETRIES_ITEMS,
  COSMETICS_ITEMS,
  EMERGENCY_MED_ITEMS,
  MISC_OPTIONAL_ITEMS,
  BABY_ITEMS,
  PET_TRAVEL_ITEMS,
  FITNESS_GYM_ITEMS,
  SWIM_WATER_ITEMS,
} from "@/shared/data/checkList";
import type { PackItem } from "@/shared/data/checkList";

import type { PackingCreateState } from "../store/packingCreateAtom";

export interface GeneratedCheckList {
  categoryName: string;
  items: PackItem[];
}

const VISA_RULES = {
  CN: { exceptions: ["cn-hainan"] },
  AU: { exceptions: [] },
} as const;

const checkVisaRequirement = (
  countryCode: string | undefined,
  regionId: string | undefined
): boolean => {
  if (!countryCode || !regionId) return false;

  const visaRule = VISA_RULES[countryCode as keyof typeof VISA_RULES];
  if (!visaRule) return false;

  return !(visaRule.exceptions as readonly string[]).includes(regionId);
};

export default function useGenerateCheckList(state: PackingCreateState) {
  const handleSetUpCheckList = () => {
    const result: GeneratedCheckList[] = [];
    const isOverseasTrip = state.region?.countryCode !== "KR";
    const isNeedVisa = checkVisaRequirement(
      state.region?.countryCode,
      state.region?.id
    );
    const visaItem = {
      name: "비자",
      required: true,
      notes: "전자비자/도착비자 규정 확인",
    };

    if (isOverseasTrip) {
      const essentialItems = [...ESSENTIAL_ITEMS];

      if (isNeedVisa) {
        essentialItems.push(visaItem);
      }

      result.push({ categoryName: "필수 준비물", items: essentialItems });
    }

    result.push(
      { categoryName: "전자제품", items: ELECTRONICS_ITEMS },
      { categoryName: "의류", items: CLOTHING_ITEMS },
      { categoryName: "세면용품", items: TOILETRIES_ITEMS },
      { categoryName: "화장품", items: COSMETICS_ITEMS },
      { categoryName: "상비약", items: EMERGENCY_MED_ITEMS },
      { categoryName: "기타용품", items: MISC_OPTIONAL_ITEMS }
    );

    if (state.companionTypes.includes("아기")) {
      result.push({
        categoryName: "유아용품",
        items: BABY_ITEMS,
      });
    }

    if (state.companionTypes.includes("반려동물")) {
      result.push({
        categoryName: "반려동물용품",
        items: PET_TRAVEL_ITEMS,
      });
    }

    if (state.tripTypes.includes("운동")) {
      result.push({
        categoryName: "운동",
        items: FITNESS_GYM_ITEMS,
      });
    }

    if (state.tripTypes.includes("수영")) {
      result.push({
        categoryName: "수영",
        items: SWIM_WATER_ITEMS,
      });
    }

    return result;
  };

  return { handleSetUpCheckList };
}
