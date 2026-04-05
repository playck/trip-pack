import type { Region } from "@/shared/data/regions";

/** 여행경보 단계 (외교부 기준) */
export type AlertLevel = 1 | 2 | 3 | 4;

export interface TravelAlert {
  /** ISO 국가코드 또는 regions.ts의 country code */
  countryCode: string;
  /** 경보 단계 */
  level: AlertLevel;
  /** 전역 여부 (false면 일부 지역만 해당) */
  nationwide: boolean;
  /** 해당 region ID 목록 (nationwide=false일 때, 특정 지역만 제외) */
  regionIds?: string[];
  /** 사유 (UI 표시용) */
  reason: string;
}

/**
 * 여행경보 3단계(출국권고) 이상 국가/지역 목록
 * 외교부 정기조정(반기 1회) 시 수동 업데이트
 * 마지막 업데이트: 2026-04-05
 */
export const travelAlerts: TravelAlert[] = [
  // 현재 regions.ts 등록 국가 중 3단계 이상 전역 해당 국가 없음
  // 예시:
  // { countryCode: "UA", level: 4, nationwide: true, reason: "러시아-우크라이나 전쟁" },
  // { countryCode: "PH", level: 4, nationwide: false, regionIds: ["ph-mindanao"], reason: "민다나오 일부 무장세력 활동" },
];

/** 특정 지역이 여행경보 3단계 이상으로 제한되는지 확인 */
export function isRegionRestricted(region: Region): boolean {
  return travelAlerts.some((alert) => {
    if (alert.level < 3) return false;
    if (alert.countryCode !== region.countryCode) return false;
    if (alert.nationwide) return true;
    return alert.regionIds?.includes(region.id) ?? false;
  });
}
