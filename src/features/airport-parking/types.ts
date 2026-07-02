import { badgePalette } from "@/shared/constants/colors";

// 인천공항 주차장 현황 (공공데이터포털 data.go.kr — B551177/StatusOfParking)

// API 원본 응답 아이템 (모든 값이 문자열로 내려옴)
export interface ParkingApiItem {
  floor: string; // 주차장 구분 (e.g. "T1 장기 P1 주차장", "T2 단기주차장 지상1층")
  parking: string; // 현재 주차 대수
  parkingarea: string; // 총 주차 면수 (0이면 미운영)
  datetm: string; // 기준 시각 "YYYYMMDDHHmmss.mmm"
}

export interface ParkingApiResponse {
  response: {
    header: {
      resultCode: string; // "00" = 성공
      resultMsg: string;
    };
    body: {
      // 정상: { item: [...] } / 단건: { item: {...} } / 일부 배열 직접 반환까지 대응
      items: { item: ParkingApiItem[] | ParkingApiItem } | ParkingApiItem[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export type ParkingTerminal = "T1" | "T2" | "기타";
export type ParkingType = "단기" | "장기" | "예약" | "기타";

// 가공된 개별 주차구역 정보
export interface ParkingLot {
  name: string; // 구역명 (floor 원본)
  terminal: ParkingTerminal;
  type: ParkingType;
  occupied: number; // 현재 주차 대수
  total: number; // 총 면수
  available: number; // 잔여 면수
  occupancyRate: number; // 만차율 0~100 (%)
  updatedAt: string; // 기준 시각 (HH:mm)
}

// 터미널·유형별 집계 그룹
export interface ParkingGroup {
  key: string; // "T1-단기"
  label: string; // "T1 단기주차장"
  terminal: ParkingTerminal;
  type: ParkingType;
  occupied: number;
  total: number;
  available: number;
  occupancyRate: number;
}

export type CongestionLevel = "여유" | "보통" | "혼잡" | "만차임박";

// 혼잡도 등급별 색상 — hex 값은 shared/constants/colors.ts(badgePalette)에서 일괄 관리
export const CONGESTION_COLORS: Record<
  CongestionLevel,
  { bg: string; text: string; bar: string }
> = {
  여유: badgePalette.positive,
  보통: badgePalette.info,
  혼잡: badgePalette.caution,
  만차임박: badgePalette.critical,
};
