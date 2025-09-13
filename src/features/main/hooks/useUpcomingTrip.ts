import { useMemo } from "react";
import dayjs from "dayjs";
import type { Trip } from "../types";

interface UpcomingTripInfo {
  trip: Trip;
  message: string;
}

export function useUpcomingTrip(futureTrips: Trip[]): UpcomingTripInfo | null {
  return useMemo(() => {
    const today = dayjs().startOf("day");

    const findUpcomingTrip = () => {
      return futureTrips.find((trip) => {
        const tripDate = dayjs(trip.start_date);
        const diffDays = tripDate.diff(today, "day");

        // 7일 이내 출발하는 여행 찾기
        return diffDays >= 0 && diffDays <= 7;
      });
    };

    const createUpcomingTripInfo = (trip: Trip): UpcomingTripInfo => {
      const tripDate = dayjs(trip.start_date);
      const diffDays = tripDate.diff(today, "day");

      if (diffDays === 0) {
        return { trip, message: "오늘 출발이에요!" };
      } else if (diffDays === 1) {
        return { trip, message: "내일 출발이에요!" };
      } else {
        return { trip, message: `${diffDays}일 후 출발이에요!` };
      }
    };

    const upcomingTrip = findUpcomingTrip();

    return upcomingTrip ? createUpcomingTripInfo(upcomingTrip) : null;
  }, [futureTrips]);
}
