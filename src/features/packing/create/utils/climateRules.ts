export type Season = "summer" | "winter" | "spring" | "fall";

/** 남반구 국가 코드 목록 */
const SOUTHERN_HEMISPHERE: ReadonlySet<string> = new Set([
  "AU", "NZ", "ZA", "AR", "CL", "BR", "PE", "UY", "PY", "BO", "FJ", "MG",
]);

/** 열대 국가 코드 목록 (연중 더운 기후) */
const TROPICAL_COUNTRIES: ReadonlySet<string> = new Set([
  "TH", "VN", "PH", "MY", "SG", "ID", "LA", "KH", "MM", "MV", "LK",
]);

/** 우기 시즌 (countryCode → 우기 월 범위, 1-based) */
const RAINY_SEASON: Record<string, number[]> = {
  TH: [5, 6, 7, 8, 9, 10],
  VN: [5, 6, 7, 8, 9, 10, 11],
  PH: [6, 7, 8, 9, 10, 11],
  MY: [10, 11, 12, 1, 2, 3],
  ID: [10, 11, 12, 1, 2, 3],
  KH: [5, 6, 7, 8, 9, 10],
  LA: [5, 6, 7, 8, 9, 10],
  MM: [5, 6, 7, 8, 9, 10],
  SG: [11, 12, 1, 2],
  MV: [5, 6, 7, 8, 9, 10, 11],
  LK: [5, 6, 7, 8, 9],
  KR: [6, 7, 8],
  JP: [6, 7, 8, 9],
};

/** 월(0-based) + 국가코드 → 계절 판단 */
export const getSeason = (month: number, countryCode: string): Season => {
  if (SOUTHERN_HEMISPHERE.has(countryCode)) {
    if (month >= 11 || month <= 1) return "summer";
    if (month >= 2 && month <= 4) return "fall";
    if (month >= 5 && month <= 7) return "winter";
    return "spring";
  }

  if (TROPICAL_COUNTRIES.has(countryCode)) {
    return "summer";
  }

  if (month >= 5 && month <= 8) return "summer";
  if (month >= 9 && month <= 10) return "fall";
  if (month >= 11 || month <= 1) return "winter";
  return "spring";
};

/** 우기 여부 확인 (month: 0-based) */
export const isRainySeason = (month: number, countryCode: string): boolean => {
  const rainyMonths = RAINY_SEASON[countryCode];
  if (!rainyMonths) return false;
  return rainyMonths.includes(month + 1);
};

/** 여행 기간 (일수) 계산 */
export const getTripDays = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);
};
