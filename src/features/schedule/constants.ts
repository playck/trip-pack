import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

/**
 * 기본 지도 중심 좌표 (서울)
 */
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

/**
 * 기본 지도 줌 레벨
 */
export const DEFAULT_MAP_ZOOM = 13;

/**
 * 포커싱 시 지도 줌 레벨
 */
export const FOCUSED_MAP_ZOOM = 16;

/**
 * 레이아웃 높이 상수
 */
export const LAYOUT_HEIGHTS = {
  PAGE_HEADER: HEADER_HEIGHT, // 페이지 기본 헤더 (50px)
  TRIP_INFO_HEADER: TRIP_INFO_HEADER_HEIGHT, // 여행 정보 헤더 (40px)
  MAP: 200, // 지도 높이 (200px)
} as const;

/**
 * 일차별 마커/라우트 색상 팔레트 (8일차 이후 순환)
 */
export const DAY_COLOR_PALETTE = [
  "#14B8A6", // 1일차 teal
  "#F97316", // 2일차 orange
  "#8B5CF6", // 3일차 purple
  "#EC4899", // 4일차 pink
  "#3B82F6", // 5일차 blue
  "#10B981", // 6일차 emerald
  "#06B6D4", // 7일차 cyan
  "#EF4444", // 8일차 red
] as const;

export function getDayColor(dayNumber: number): string {
  if (dayNumber < 1) return DAY_COLOR_PALETTE[0];
  return DAY_COLOR_PALETTE[(dayNumber - 1) % DAY_COLOR_PALETTE.length];
}
