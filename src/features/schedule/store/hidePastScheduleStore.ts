import { atomWithStorage } from "jotai/utils";

/** tripId → 지난 일정 숨김 여부 */
export const hidePastScheduleAtom = atomWithStorage<Record<string, boolean>>(
  "trip-pack-hide-past-schedule",
  {}
);
