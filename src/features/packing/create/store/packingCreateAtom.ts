import type { Region } from "@/shared/data/regions";
import { atom } from "jotai";

export const packingCreateAtom = atom<PackingCreateState>({
  region: null,
});

export type PackingCreateState = {
  region: Region | null;
};
