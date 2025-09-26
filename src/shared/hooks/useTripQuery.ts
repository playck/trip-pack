import { useQuery } from "@tanstack/react-query";
import { getTripInfo } from "../service/tripInfo";

export const useTripInfo = (tripId: string | undefined) => {
  return useQuery({
    queryKey: ["tripInfo", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getTripInfo(tripId);
    },
    enabled: !!tripId,
  });
};
