import dayjs from "dayjs";
import type { ParkingAirport } from "./types";

// 공식 주차 요금 — 소형차 기준, 2026-07 공식 사이트 확인. 요금 개정 시 수동 갱신 필요.
// 인천: airport.kr 주차 안내 / 김포: airport.co.kr/gimpo 주차 안내
interface ParkingFeeRow {
  label: string;
  note: string;
}

export const PARKING_FEE_ROWS: Record<ParkingAirport, ParkingFeeRow[]> = {
  ICN: [
    { label: "단기주차장", note: "30분 1,200원 · 15분당 600원 · 1일 24,000원" },
    { label: "장기주차장", note: "1시간 1,000원 · 1일 9,000원" },
  ],
  GMP: [
    { label: "기본요금", note: "30분 1,000원 · 15분당 500원" },
    { label: "국내선", note: "1일 20,000원 (주말 30,000원)" },
    { label: "국제선", note: "1일 20,000원 (주말 30,000원)" },
  ],
};

const ICN_LONG_TERM_DAILY = 9_000;
const GMP_DOMESTIC_DAILY = { weekday: 20_000, weekend: 30_000 };

// 김포는 금·토·일(및 공휴일 — 계산에서는 제외)에 주말 요금이 적용된다
const isGmpWeekendRate = (date: dayjs.Dayjs): boolean => {
  const dayOfWeek = date.day();
  return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
};

// 여행 기간 기준 예상 주차 요금 (인천=장기주차장, 김포=국내선 주차장 기준)
export const estimateParkingFee = (
  airport: ParkingAirport,
  startDate: string,
  days: number,
): { basisLabel: string; amount: number } | null => {
  if (!startDate || !Number.isFinite(days) || days < 1) return null;

  if (airport === "ICN") {
    return { basisLabel: "장기주차장", amount: days * ICN_LONG_TERM_DAILY };
  }

  let amount = 0;
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, "day");
    amount += isGmpWeekendRate(date)
      ? GMP_DOMESTIC_DAILY.weekend
      : GMP_DOMESTIC_DAILY.weekday;
  }
  return { basisLabel: "국내선 주차장", amount };
};
