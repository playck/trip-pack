import { useSuspenseQuery } from "@tanstack/react-query";
import { getTripDetail } from "./api";
import type { Trip } from "../types";

export function useTripDetail(tripId: string) {
  const { data: trip, error } = useSuspenseQuery<Trip>({
    queryKey: ["trip", tripId],
    queryFn: () => getTripDetail(tripId),
  });

  return {
    trip,
    isLoading: false,
    error: error ? (error as Error).message : null,
  };
}
