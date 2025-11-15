import { useQuery } from "@tanstack/react-query";
import { getExpensesByTrip } from "../services/api";

export function useTripExpenses(tripId: string | undefined) {
  return useQuery({
    queryKey: ["tripExpenses", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getExpensesByTrip(tripId);
    },
    enabled: !!tripId,
  });
}
