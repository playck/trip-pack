import { useCallback } from "react";
import { generateCheckList } from "../utils/generateCheckList";
import type { PackingCreateState } from "../store/packingCreateAtom";

export type { GeneratedCheckList } from "../utils/generateCheckList";

export default function useGenerateCheckList(state: PackingCreateState) {
  const handleSetUpCheckList = useCallback(
    () => generateCheckList(state),
    [state],
  );

  return { handleSetUpCheckList };
}
