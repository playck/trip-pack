import { fetchDataGoKr } from "@/shared/service/dataGoKr";
import type {
  KacParkingApiBody,
  KacParkingApiItem,
  ParkingApiItem,
  ParkingApiResponse,
  ParkingLot,
} from "../types";
import {
  calcOccupancyRate,
  classifyTerminal,
  classifyType,
  formatKacParkingTime,
  formatParkingTime,
} from "../utils";

const PARKING_URL =
  "https://apis.data.go.kr/B551177/StatusOfParking/getTrackingParking";
// KAC(한국공항공사) 전국공항 주차장 혼잡도_GW — 면수·만차율 포함, schAirportCode로 공항 필터
const KAC_PARKING_URL =
  "https://apis.data.go.kr/B551178/parking-congestion/info";
// 공항별 주차구역 수는 수십 개 수준이라 100이면 전량 조회됨 (페이지네이션 불필요)
const NUM_OF_ROWS = 100;

type ParkingApiBody = ParkingApiResponse["response"]["body"];

// 표준 응답은 { item: [...] }, 단건은 { item: {...} } 형태.
const extractItems = <T>(
  items: { item: T[] | T } | T[] | undefined | null,
): T[] => {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (!items.item) return [];
  return Array.isArray(items.item) ? items.item : [items.item];
};

// 숫자/문자열 혼재(KAC는 숫자, 인천은 문자열)·콤마 표기·비숫자를 방어하는 숫자 파싱
const toCount = (value: string | number): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.max(Math.round(value), 0) : 0;
  }
  const digits = (value || "").replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

const toParkingLot = (item: ParkingApiItem): ParkingLot => {
  const occupied = toCount(item.parking);
  const total = toCount(item.parkingarea);
  const available = Math.max(total - occupied, 0);

  return {
    name: item.floor,
    terminal: classifyTerminal(item.floor),
    type: classifyType(item.floor),
    occupied,
    total,
    available,
    occupancyRate: calcOccupancyRate(occupied, total),
    updatedAt: formatParkingTime(item.datetm),
  };
};

// 인천공항 주차장 실시간 현황 조회 (미운영 구역 제외)
export const getParkingStatus = async (
  signal?: AbortSignal,
): Promise<ParkingLot[]> => {
  const body = await fetchDataGoKr<ParkingApiBody>(
    PARKING_URL,
    { numOfRows: NUM_OF_ROWS, pageNo: 1 },
    { label: "주차장 현황", signal },
  );

  return extractItems(body.items)
    .map(toParkingLot)
    .filter((lot) => lot.total > 0);
};

const toGimpoParkingLot = (item: KacParkingApiItem): ParkingLot => {
  const occupied = toCount(item.parkingOccupiedSpace);
  const total = toCount(item.parkingTotalSpace);

  return {
    name: item.parkingAirportCodeName,
    terminal: "기타",
    type: "기타",
    occupied,
    total,
    available: Math.max(total - occupied, 0),
    occupancyRate: calcOccupancyRate(occupied, total),
    updatedAt: formatKacParkingTime(item.sysGettime),
  };
};

// 김포공항 주차장 실시간 현황 조회 (미운영 구역 제외)
export const getGimpoParkingStatus = async (
  signal?: AbortSignal,
): Promise<ParkingLot[]> => {
  const body = await fetchDataGoKr<KacParkingApiBody>(
    KAC_PARKING_URL,
    { numOfRows: NUM_OF_ROWS, pageNo: 1, schAirportCode: "GMP" },
    { label: "주차장 현황", signal },
  );

  return extractItems(body.items)
    .map(toGimpoParkingLot)
    .filter((lot) => lot.total > 0);
};
