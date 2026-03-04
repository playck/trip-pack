import { useSuspenseQuery } from "@tanstack/react-query";
import { getTripInfo } from "./tripInfo";

export const useTripInfo = (tripId: string | undefined) => {
  return useSuspenseQuery({
    queryKey: ["tripInfo", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getTripInfo(tripId);
    },
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
  });
};
