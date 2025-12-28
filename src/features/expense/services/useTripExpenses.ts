import { useSuspenseQuery } from "@tanstack/react-query";
import { getExpensesByTrip } from "./api";

export function useTripExpenses(tripId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ["tripExpenses", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getExpensesByTrip(tripId);
    },
  });
}
