import {
  FITNESS_GYM_ITEMS,
  SWIM_WATER_ITEMS,
  KOREAN_FOOD_ITEMS,
  BUSINESS_ITEMS,
  SIGHTSEEING_ITEMS,
  NATURE_ITEMS,
  ACTIVITY_ITEMS,
  RESORT_ITEMS,
  SHOPPING_ITEMS,
} from "@/shared/data/checkList";
import type { PackItem } from "@/shared/data/checkList";

import type { TripTypeOption } from "../data/data";

/** 여행 유형 → 카테고리명 + 아이템 매핑 */
export const TRIP_TYPE_CATEGORY_MAP: Record<
  TripTypeOption,
  { categoryName: string; items: PackItem[] }
> = {
  운동: { categoryName: "운동", items: FITNESS_GYM_ITEMS },
  수영: { categoryName: "수영", items: SWIM_WATER_ITEMS },
  출장: { categoryName: "출장", items: BUSINESS_ITEMS },
  관광: { categoryName: "관광", items: SIGHTSEEING_ITEMS },
  자연: { categoryName: "자연", items: NATURE_ITEMS },
  액티비티: { categoryName: "액티비티", items: ACTIVITY_ITEMS },
  휴양: { categoryName: "휴양", items: RESORT_ITEMS },
  쇼핑: { categoryName: "쇼핑", items: SHOPPING_ITEMS },
  미식: { categoryName: "한식", items: KOREAN_FOOD_ITEMS },
};
