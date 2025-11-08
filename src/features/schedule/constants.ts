import { HEADER_HEIGHT } from "@/shared/constants/layout";

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
  PAGE_HEADER: HEADER_HEIGHT, // 페이지 기본 헤더
  TRIP_HEADER: 53, // 여행 정보 헤더
  MAP: 235, // 지도 높이
} as const;

/**
 * 일정 일차 카드 헤더의 sticky top 위치
 */
export const DAY_CARD_STICKY_TOP =
  LAYOUT_HEIGHTS.PAGE_HEADER + LAYOUT_HEIGHTS.TRIP_HEADER + LAYOUT_HEIGHTS.MAP;
