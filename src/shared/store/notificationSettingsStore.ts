import { atomWithStorage } from "jotai/utils";

/** 여행 리마인더(D-7·D-3·D-1·D-day) 전역 ON/OFF — 기기 단위 저장 */
export const tripReminderEnabledAtom = atomWithStorage(
  "trip-pack-trip-reminder-enabled",
  true
);
