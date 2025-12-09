import { useSuspenseQuery } from "@tanstack/react-query";
import { getTripSchedules } from "./api";

/**
 * 여행의 전체 일정 조회
 */
export const useTripSchedules = (tripId: string | undefined) => {
  return useSuspenseQuery({
    queryKey: ["tripSchedules", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getTripSchedules(tripId);
    },
  });
};
