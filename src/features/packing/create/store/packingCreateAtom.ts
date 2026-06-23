import { atom } from "jotai";

import type { Region } from "@/shared/data/regions";
import type { TravelDates } from "@/shared/components/Calendar";
import type { GeneratedCheckList } from "../hooks/useGenerateCheckList";
import type {
  CompanionType,
  CompanionTypeOption,
  TripTypeOption,
} from "../data/data";

/** 체크리스트 생성 방식: 조건 기반 자동 생성 vs 저장된 내 템플릿 적용 */
export type PackingStartMode = "auto" | "template";

export type PackingCreateState = {
  region: Region | null;
  dates: TravelDates;
  companion: CompanionType | null;
  companionTypes: CompanionTypeOption[];
  tripTypes: TripTypeOption[];
  startMode: PackingStartMode;
  generatedCheckList?: GeneratedCheckList[];
};

export const INITIAL_PACKING_CREATE_STATE: PackingCreateState = {
  region: null,
  dates: {
    startDate: null,
    endDate: null,
  },
  companion: null,
  companionTypes: [],
  tripTypes: [],
  startMode: "auto",
  generatedCheckList: undefined,
};

export const packingCreateAtom = atom<PackingCreateState>(
  INITIAL_PACKING_CREATE_STATE
);

export const packingCreateValidationAtom = atom((get) => {
  const state = get(packingCreateAtom);
  return {
    hasRegion: !!state.region,
    hasDates: !!(state.dates.startDate && state.dates.endDate),
    hasCompanion:
      !!state.companion &&
      (state.companion === "alone" || state.companionTypes.length > 0),
  };
});
