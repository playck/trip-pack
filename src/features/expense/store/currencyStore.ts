import { atomWithStorage } from "jotai/utils";

export const showLocalCurrencyAtom = atomWithStorage<boolean>(
  "trip-pack-show-local-currency",
  false
);
