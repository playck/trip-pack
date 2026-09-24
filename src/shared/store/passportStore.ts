import { atomWithStorage } from "jotai/utils";

/**
 * 내 여권 만료일 (`YYYY-MM-DD`). `null` = 아직 등록 안 함.
 *
 * **기기 안에만 둔다.** 서버로 보내지 않으므로 개인정보 "수집"이 아니고,
 * 개인정보처리방침·App Privacy 공시를 건드릴 일이 없다. 대신 기기를 바꾸거나
 * 앱을 지우면 값이 사라진다 — 그때 경고가 조용히 꺼지지 않도록,
 * 마이페이지 행은 값이 없어도 숨지 않고 `미등록` 상태로 되돌아온다.
 *
 * 타입이 `Date` 가 아니라 문자열인 이유: `atomWithStorage` 가 JSON 직렬화하면서
 * `Date` 를 ISO 문자열로 바꿔 복원 시 타입이 거짓말을 한다. `<Input type="date">`
 * 의 `value` 도 정확히 이 포맷이고, 프로젝트의 다른 날짜들도 전부 문자열이다.
 *
 * `getOnInit: true` 가 없으면 첫 렌더에 `null` 이 나와, 이미 등록한 사용자에게도
 * `미등록` 이 한 프레임 깜빡인다([[packingStyleStore]] 에서 겪은 그 버그).
 *
 * 키에 `userId` 를 넣지 않는다 — 넣으려면 auth 왕복을 기다려야 해서
 * "동기로 읽는다"는 목적이 사라진다. 1인 1기기를 전제한다.
 */
export const passportExpiryAtom = atomWithStorage<string | null>(
  "trip-pack-passport-expiry",
  null,
  undefined,
  { getOnInit: true },
);
