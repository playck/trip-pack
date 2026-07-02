import { fetchDataGoKr } from "@/shared/service/dataGoKr";
import type { ParkingApiItem, ParkingApiResponse, ParkingLot } from "../types";
import {
  calcOccupancyRate,
  classifyTerminal,
  classifyType,
  formatParkingTime,
} from "../utils";

const PARKING_URL =
  "https://apis.data.go.kr/B551177/StatusOfParking/getTrackingParking";
// 인천공항 주차구역 수는 수십 개 수준이라 100이면 전량 조회됨 (페이지네이션 불필요)
const NUM_OF_ROWS = 100;

type ParkingApiBody = ParkingApiResponse["response"]["body"];

// 표준 응답은 { item: [...] }, 단건은 { item: {...} } 형태.
// 일부 응답이 items 자리에 배열을 직접 주는 경우까지 함께 평탄화한다.
const extractItems = (items: ParkingApiBody["items"]): ParkingApiItem[] => {
  if (Array.isArray(items)) return items;
  if (!items || !items.item) return [];
  return Array.isArray(items.item) ? items.item : [items.item];
};

// 콤마 구분("3,712")·비숫자 표기를 방어하는 숫자 파싱 (실측은 순수 숫자 문자열)
const toCount = (value: string): number => {
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
