import dayjs from "dayjs";
import type { TripFlight } from "@/features/flight/types";
import type {
  CongestionLevel,
  ParkingAirport,
  ParkingGroup,
  ParkingLot,
  ParkingTerminal,
  ParkingType,
} from "./types";
import { CONGESTION_COLORS } from "./types";

const PARKING_AIRPORTS: ParkingAirport[] = ["ICN", "GMP"];

// 노출 정책: 지원 공항(인천·김포) 출발편의 출발 당일(D-0)에만 주차장 현황을 제공한다.
// 조건 충족 시 해당 공항 코드를, 아니면 null을 반환 — 조건은 이곳 한 군데에서 관리한다.
export const getParkingAirport = (
  flight?: TripFlight,
): ParkingAirport | null => {
  if (!flight || flight.flight_type !== "departure") return null;
  if (dayjs().format("YYYY-MM-DD") !== flight.scheduled_date) return null;

  return (
    PARKING_AIRPORTS.find((code) => code === flight.departure_airport) ?? null
  );
};

// "20211103162024.804" → "16:20" (기준 시각)
export const formatParkingTime = (datetm: string): string => {
  const digits = (datetm || "").replace(/\D/g, "");
  if (digits.length < 12) return "--:--";
  return `${digits.substring(8, 10)}:${digits.substring(10, 12)}`;
};

// KAC 업데이트 시간("HH:MM:SS"·"HHMM" 등 표기 편차 방어) → "HH:mm"
export const formatKacParkingTime = (gettime: string): string => {
  const digits = (gettime || "").replace(/\D/g, "");
  if (digits.length < 4) return "--:--";
  return `${digits.substring(0, 2)}:${digits.substring(2, 4)}`;
};

// floor 문자열에서 터미널 판별 (정확한 표기가 불확실하므로 문자열 포함 매칭)
export const classifyTerminal = (floor: string): ParkingTerminal => {
  if (floor.includes("T1")) return "T1";
  if (floor.includes("T2")) return "T2";
  return "기타";
};

export const classifyType = (floor: string): ParkingType => {
  if (floor.includes("예약")) return "예약";
  if (floor.includes("단기")) return "단기";
  if (floor.includes("장기")) return "장기";
  return "기타";
};

// 만차율 → 혼잡도 등급
const getCongestionLevel = (rate: number): CongestionLevel => {
  if (rate >= 95) return "만차임박";
  if (rate >= 85) return "혼잡";
  if (rate >= 60) return "보통";
  return "여유";
};

// 만차율 → 등급 + 색상
export const getCongestion = (rate: number) => {
  const level = getCongestionLevel(rate);
  return { level, ...CONGESTION_COLORS[level] };
};

// 만차율(%) — 0 나누기 방지 + 0~100 상한
export const calcOccupancyRate = (occupied: number, total: number): number =>
  total > 0 ? Math.min(Math.round((occupied / total) * 100), 100) : 0;

// 터미널·유형별 집계. floor 표기가 불확실해도 데이터를 누락하지 않도록
// 판별 불가 항목은 "기타" 그룹으로 합산해 모두 노출한다.
const GROUP_ORDER: ParkingType[] = ["단기", "장기", "예약", "기타"];
const TERMINAL_ORDER: ParkingTerminal[] = ["T1", "T2", "기타"];

export const groupParkingLots = (lots: ParkingLot[]): ParkingGroup[] => {
  const groups = new Map<string, ParkingGroup>();

  for (const lot of lots) {
    const key = `${lot.terminal}-${lot.type}`;
    const prev = groups.get(key);
    const occupied = (prev?.occupied ?? 0) + lot.occupied;
    const total = (prev?.total ?? 0) + lot.total;

    groups.set(key, {
      key,
      label:
        lot.terminal === "기타"
          ? `${lot.type}주차장`
          : `${lot.terminal} ${lot.type}주차장`,
      terminal: lot.terminal,
      type: lot.type,
      occupied,
      total,
      available: Math.max(total - occupied, 0),
      occupancyRate: calcOccupancyRate(occupied, total),
    });
  }

  return [...groups.values()].sort((a, b) => {
    const t =
      TERMINAL_ORDER.indexOf(a.terminal) - TERMINAL_ORDER.indexOf(b.terminal);
    if (t !== 0) return t;
    return GROUP_ORDER.indexOf(a.type) - GROUP_ORDER.indexOf(b.type);
  });
};

// 김포 등 KAC 공항은 주차장 수가 적어 집계 없이 주차장 단위 그대로 노출
export const lotsToGroups = (lots: ParkingLot[]): ParkingGroup[] =>
  lots.map((lot) => ({
    key: lot.name,
    label: lot.name,
    terminal: lot.terminal,
    type: lot.type,
    occupied: lot.occupied,
    total: lot.total,
    available: lot.available,
    occupancyRate: lot.occupancyRate,
  }));
