import { atomWithStorage } from "jotai/utils";

/**
 * 내 여권 만료일 (`YYYY-MM-DD`). `null` = 미등록.
 *
 * **기기 안에만 둔다.** 서버로 안 보내면 개인정보 "수집"이 아니라
 * 처리방침·App Privacy 공시를 건드릴 일이 없다. 대신 기기를 바꾸면 값이 사라지므로,
 * 마이페이지 행은 값이 없어도 숨지 않고 `미등록` 으로 되돌아온다.
 *
 * `getOnInit: true` 가 없으면 첫 렌더에 `null` 이 나와 `미등록` 이 한 프레임 깜빡인다.
 * 키에 `userId` 를 넣으면 auth 왕복을 기다려야 해서 동기로 읽는 목적이 사라진다.
 */
export const passportExpiryAtom = atomWithStorage<string | null>(
  "trip-pack-passport-expiry",
  null,
  undefined,
  { getOnInit: true },
);
