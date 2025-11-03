import { useMemo } from "react";
import { useTripSchedules } from "../services/useTripSchedules";
import type { Schedule } from "../types";

/**
 * 특정 일차의 일정 목록 조회
 */
export const useSchedulesByDay = (
  tripId: string | undefined,
  dayNumber: number
): {
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
} => {
  const { data, isLoading, error } = useTripSchedules(tripId);

  const schedules = useMemo(() => {
    if (!data) return [];
    return data.filter((schedule) => schedule.day_number === dayNumber);
  }, [data, dayNumber]);

  return {
    schedules,
    isLoading,
    error,
  };
};
