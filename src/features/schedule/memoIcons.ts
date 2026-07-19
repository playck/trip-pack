import {
  StickyNote,
  MapPin,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Binoculars,
  TreePine,
  FerrisWheel,
  BedDouble,
  Car,
  Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ScheduleIconOption {
  key: string;
  icon: LucideIcon;
  label: string;
}

/**
 * 공통 활동 타입 아이콘 (메모 · 일반 일정 공용).
 * key 값은 trip_schedules.category 컬럼에 저장된다.
 */
export const ACTIVITY_ICON_OPTIONS: ScheduleIconOption[] = [
  { key: "food", icon: UtensilsCrossed, label: "식당" },
  { key: "cafe", icon: Coffee, label: "카페" },
  { key: "shopping", icon: ShoppingBag, label: "쇼핑" },
  { key: "photo", icon: Binoculars, label: "관광" },
  { key: "nature", icon: TreePine, label: "자연" },
  { key: "activity", icon: FerrisWheel, label: "액티비티" },
  { key: "stay", icon: BedDouble, label: "숙소" },
  { key: "transport", icon: Car, label: "이동" },
  { key: "ticket", icon: Ticket, label: "티켓" },
];

/**
 * 메모 아이콘: 메모(기본) + 활동 타입
 */
export const MEMO_ICON_OPTIONS: ScheduleIconOption[] = [
  { key: "memo", icon: StickyNote, label: "메모" },
  ...ACTIVITY_ICON_OPTIONS,
];

/**
 * 장소(구글맵 일정) 아이콘: 장소(기본 핀) + 활동 타입
 */
export const PLACE_ICON_OPTIONS: ScheduleIconOption[] = [
  { key: "place", icon: MapPin, label: "장소" },
  ...ACTIVITY_ICON_OPTIONS,
];

export const DEFAULT_MEMO_ICON_KEY = "memo";
export const DEFAULT_PLACE_ICON_KEY = "place";

const findActivityIcon = (
  category: string | null | undefined,
): LucideIcon | undefined =>
  ACTIVITY_ICON_OPTIONS.find((option) => option.key === category)?.icon;

/**
 * 메모 아이콘 조회. 매칭 없으면 기본(StickyNote).
 */
export const getMemoIcon = (category: string | null | undefined): LucideIcon =>
  findActivityIcon(category) ?? StickyNote;

/**
 * 장소 일정 아이콘 조회. 매칭 없으면 기본(MapPin).
 */
export const getPlaceIcon = (category: string | null | undefined): LucideIcon =>
  findActivityIcon(category) ?? MapPin;

/**
 * 구글 Place types → 아이콘 키 매핑 (일정 자동 분류용).
 * types 배열은 보통 구체적인 타입이 앞에 오므로 첫 매칭을 사용한다.
 */
const GOOGLE_TYPE_TO_ICON_KEY: Record<string, string> = {
  // 식당
  restaurant: "food",
  meal_takeaway: "food",
  meal_delivery: "food",
  bar: "food",
  food: "food",
  // 카페 · 베이커리
  cafe: "cafe",
  bakery: "cafe",
  // 쇼핑
  store: "shopping",
  shopping_mall: "shopping",
  department_store: "shopping",
  clothing_store: "shopping",
  shoe_store: "shopping",
  jewelry_store: "shopping",
  supermarket: "shopping",
  convenience_store: "shopping",
  book_store: "shopping",
  electronics_store: "shopping",
  // 관광 · 명소
  tourist_attraction: "photo",
  museum: "photo",
  art_gallery: "photo",
  church: "photo",
  hindu_temple: "photo",
  mosque: "photo",
  synagogue: "photo",
  city_hall: "photo",
  // 자연
  park: "nature",
  natural_feature: "nature",
  campground: "nature",
  zoo: "nature",
  aquarium: "nature",
  // 액티비티
  amusement_park: "activity",
  movie_theater: "activity",
  bowling_alley: "activity",
  night_club: "activity",
  casino: "activity",
  spa: "activity",
  stadium: "activity",
  gym: "activity",
  // 숙소
  lodging: "stay",
  // 이동 · 교통
  airport: "transport",
  train_station: "transport",
  subway_station: "transport",
  light_rail_station: "transport",
  transit_station: "transport",
  bus_station: "transport",
  taxi_stand: "transport",
  car_rental: "transport",
  parking: "transport",
};

/**
 * 구글 Place types 배열에서 아이콘 키를 추론. 매칭 없으면 undefined(기본 핀).
 */
export const mapGoogleTypesToIconKey = (
  types?: string[],
): string | undefined => {
  if (!types) return undefined;
  for (const type of types) {
    const key = GOOGLE_TYPE_TO_ICON_KEY[type];
    if (key) return key;
  }
  return undefined;
};
