import dayjs from "dayjs";

/**
 * 입국일 기준 요구되는 여권 잔여 유효기간(개월).
 *
 * 국가별 차등을 두지 않는다. 구조화된 국가별 요건이 4개국(CN·MY·AU·NZ)뿐이고
 * 나머지는 원문 텍스트로만 있어서, 지금 나누면 대부분이 근거 없는 숫자가 된다.
 */
export const PASSPORT_VALIDITY_MONTHS = 6;

export type PassportExpiryStatus =
  | "unregistered"
  | "expired"
  | "insufficient"
  | "ok";

export interface PassportExpiryCheck {
  status: PassportExpiryStatus;
  /** 기준일 대비 잔여 개월(내림). `unregistered` 면 `null` */
  monthsLeft: number | null;
}

/**
 * `dayjs("2026-13-45")` 는 13월 45일을 다음 해로 굴려서 `isValid()` 가 `true` 다.
 * 그대로 두면 깨진 저장소 값이 정상 날짜로 둔갑한다. `customParseFormat` 플러그인은
 * 전역 부수효과가 있어, 파싱한 값을 도로 포맷해 원본과 같은지만 본다.
 */
function parseStrictDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const parsed = dayjs(value).startOf("day");
  if (!parsed.isValid() || parsed.format("YYYY-MM-DD") !== value) return null;

  return parsed;
}

/**
 * 여권 만료일이 해당 여행에 쓸 수 있는지 판정한다.
 * **"오늘"을 참조하지 않는다** — 메모이제이션해도 값이 낡지 않는다.
 *
 * @param basisDate 판정 기준일 `YYYY-MM-DD` (보통 여행 출발일)
 */
export function checkPassportExpiry(
  expiryDate: string | null,
  basisDate: string,
): PassportExpiryCheck {
  const expiry = expiryDate ? parseStrictDate(expiryDate) : null;
  const basis = parseStrictDate(basisDate);

  // 읽을 수 없는 값을 `ok` 로 떨어뜨리면 경고가 조용히 꺼지고,
  // 사용자는 "문제 없다"로 읽는다.
  if (!expiry || !basis) return { status: "unregistered", monthsLeft: null };

  // 기준일 당일 만료도 입국이 막힌다.
  if (!expiry.isAfter(basis)) return { status: "expired", monthsLeft: 0 };

  // dayjs 의 month diff 는 내림이라 "6개월 이상" 경계와 그대로 맞는다.
  const monthsLeft = expiry.diff(basis, "month");

  return {
    status: monthsLeft < PASSPORT_VALIDITY_MONTHS ? "insufficient" : "ok",
    monthsLeft,
  };
}
