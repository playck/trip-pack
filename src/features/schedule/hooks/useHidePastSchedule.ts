import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";

import { hidePastScheduleAtom } from "../store/hidePastScheduleStore";

export function useHidePastSchedule(
  tripId: string,
  startDate?: string,
  endDate?: string
) {
  const [hidePastMap, setHidePastMap] = useAtom(hidePastScheduleAtom);
  const hidePast = hidePastMap[tripId] ?? true;

  const toggleHidePast = useCallback(() => {
    setHidePastMap((prev) => ({ ...prev, [tripId]: !hidePast }));
  }, [tripId, hidePast, setHidePastMap]);

  const todayDayNumber = useMemo(() => {
    if (!startDate) return 0;
    const today = dayjs().format("YYYY-MM-DD");
    return dayjs(today).diff(dayjs(startDate), "day") + 1;
  }, [startDate]);

  const tripDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return dayjs(endDate).diff(dayjs(startDate), "day") + 1;
  }, [startDate, endDate]);

  const isTraveling = todayDayNumber >= 1 && todayDayNumber <= tripDays;
  const showToggle = isTraveling && todayDayNumber > 1;

  return {
    hidePast,
    toggleHidePast,
    todayDayNumber,
    showToggle,
  };
}
