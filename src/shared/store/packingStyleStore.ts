import { atomWithStorage } from "jotai/utils";

import type { PackingStyle } from "@/shared/data/checkList";

/**
 * 내 짐 스타일. `null` = 아직 안 물어봄 → 마법사에 질문 단계를 띄운다.
 *
 * **DB(`profiles.packing_style`)가 아니라 여기가 화면 판단의 기준이다.**
 * DB를 읽으려면 `supabase.auth.getUser()` 왕복부터 기다려야 해서,
 * 마법사가 단계 수를 모르는 채로 먼저 그려진다. 이 값은 동기로 읽히므로
 * 첫 페인트부터 단계 수가 정확하다.
 *
 * 로컬이 비어 있을 때만 DB 값으로 채운다 — [[usePackingStyle]].
 *
 * 키에 `userId` 를 넣지 않는다. 넣으면 auth 를 기다려야 해서 목적이 사라진다.
 * 대신 계정을 바꾸면 이전 사용자의 성향이 첫 판단에 쓰인다(1인 1기기 전제).
 */
export const packingStyleAtom = atomWithStorage<PackingStyle | null>(
  "trip-pack-packing-style",
  null,
  undefined,
  { getOnInit: true },
);
