import { atom } from "jotai";

import type { Region } from "@/shared/data/regions";
import type { TravelDates } from "@/shared/components/Calendar";
import type {
  CompanionType,
  CompanionTypeOption,
  TripTypeOption,
} from "../data/data";

export type PackingCreateState = {
  region: Region | null;
  dates: TravelDates;
  companion: CompanionType | null;
  companionTypes: CompanionTypeOption[];
  tripTypes: TripTypeOption[];
};

export const packingCreateAtom = atom<PackingCreateState>({
  region: null,
  dates: {
    startDate: null,
    endDate: null,
  },
  companion: null,
  companionTypes: [],
  tripTypes: [],
});

export const packingCreateValidationAtom = atom((get) => {
  const state = get(packingCreateAtom);
  return {
    hasRegion: !!state.region,
    hasDates: !!(state.dates.startDate && state.dates.endDate),
    hasCompanion:
      !!state.companion &&
      (state.companion === "alone" || state.companionTypes.length > 0),
    hasTripTypes: state.tripTypes.length > 0,
  };
});
