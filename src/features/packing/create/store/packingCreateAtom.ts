import { atom } from "jotai";

import type { Region } from "@/shared/data/regions";
import type { TravelDates } from "@/shared/components/Calendar";

export type PackingCreateState = {
  region: Region | null;
  dates: TravelDates;
};

export const packingCreateAtom = atom<PackingCreateState>({
  region: null,
  dates: {
    startDate: null,
    endDate: null,
  },
});

export const packingCreateValidationAtom = atom((get) => {
  const state = get(packingCreateAtom);
  return {
    hasRegion: !!state.region,
    hasDates: !!(state.dates.startDate && state.dates.endDate),
  };
});
