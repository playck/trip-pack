import dayjs from "dayjs";

/**
 * 입국일 기준 요구되는 여권 잔여 유효기간(개월).
 *
 * 국가별 차등을 두지 않는다. 구조화된 국가별 요건이 4개국(CN·MY·AU·NZ)뿐이고
 * 나머지는 원문 텍스트로만 있어서, 지금 국가별로 나누면 대부분이 근거 없는
 * 숫자가 된다. 6개월은 앱의 기존 안내 문구가 이미 쓰는 기준이라 일관된다.
 */
export const PASSPORT_VALIDITY_MONTHS = 6;

export type PassportExpiryStatus =
  /** 저장된 값이 없거나 읽을 수 없다 */
  | "unregistered"
  /** 기준일에 이미 만료됐다 */
  | "expired"
  /** 잔여 기간이 요건에 못 미친다 */
  | "insufficient"
  /** 요건을 충족한다 */
  | "ok";

export interface PassportExpiryCheck {
  status: PassportExpiryStatus;
  /** 기준일 대비 잔여 개월(내림). `unregistered` 면 `null` */
  monthsLeft: number | null;
  /** 요건을 채우려면 최소 이 날짜까지 유효해야 한다. `unregistered` 면 `null` */
  requiredValidUntil: string | null;
}

/**
 * `YYYY-MM-DD` 인지 엄격하게 확인한다.
 *
 * `dayjs("2026-13-45")` 는 13월 45일을 다음 해로 굴려서 `isValid()` 가 `true` 다.
 * 그대로 두면 깨진 저장소 값이 정상 날짜로 둔갑해 판정이 `ok` 로 떨어진다.
 * `customParseFormat` 플러그인을 붙이면 전역 부수효과가 생기므로,
 * 파싱한 값을 도로 포맷해 원본과 같은지만 본다.
 */
function parseStrictDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const parsed = dayjs(value).startOf("day");
  if (!parsed.isValid() || parsed.format("YYYY-MM-DD") !== value) return null;

  return parsed;
}

/**
 * 여권 만료일이 해당 여행에 쓸 수 있는지 판정한다.
 *
 * **"오늘"을 참조하지 않는다.** 입력이 만료일과 기준일 두 개뿐이라
 * 메모이제이션해도 값이 낡지 않고, 테스트도 고정 날짜로 끝난다.
 *
 * @param expiryDate 여권 만료일 `YYYY-MM-DD`. 없으면 `null`
 * @param basisDate  판정 기준일 `YYYY-MM-DD` (보통 여행 출발일)
 */
export function checkPassportExpiry(
  expiryDate: string | null,
  basisDate: string,
): PassportExpiryCheck {
  const expiry = expiryDate ? parseStrictDate(expiryDate) : null;
  const basis = parseStrictDate(basisDate);

  // 읽을 수 없는 값은 `ok` 로 떨어뜨리지 않는다. 그랬다가는 저장소가 비거나
  // 값이 깨졌을 때 경고가 조용히 꺼지고, 사용자는 "문제 없다"로 읽는다.
  if (!expiry || !basis) {
    return {
      status: "unregistered",
      monthsLeft: null,
      requiredValidUntil: null,
    };
  }

  const requiredValidUntil = basis
    .add(PASSPORT_VALIDITY_MONTHS, "month")
    .format("YYYY-MM-DD");

  // 기준일 당일 만료도 입국이 막히므로 `expired` 로 본다.
  if (!expiry.isAfter(basis)) {
    return { status: "expired", monthsLeft: 0, requiredValidUntil };
  }

  // dayjs 의 month diff 는 내림이라 "6개월 이상" 경계와 그대로 맞는다.
  // (출발 3/01 + 만료 9/01 → 6 → ok, 8/31 → 5 → insufficient)
  const monthsLeft = expiry.diff(basis, "month");

  return {
    status: monthsLeft < PASSPORT_VALIDITY_MONTHS ? "insufficient" : "ok",
    monthsLeft,
    requiredValidUntil,
  };
}
