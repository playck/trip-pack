import { useSuspenseQuery } from "@tanstack/react-query";
import { getTripList } from "./api";
import type { Trip, TripListData } from "../types";

export interface UseTripListReturn {
  currentTrips: Trip[] | null;
  futureTrips: Trip[];
  pastTrips: Trip[];
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  noTripList: boolean;
  noActiveTripList: boolean;
  hasPastTrips: boolean;
}

export function useTripList(): UseTripListReturn {
  const { data, error } = useSuspenseQuery<TripListData>({
    queryKey: ["tripList"],
    queryFn: getTripList,
    retry: false,
    meta: { persist: true },
  });

  const hasPastTrips = !!data.pastTrips?.length;
  const noActiveTripList =
    !data.currentTrips?.length && !data.futureTrips?.length;
  const noTripList = noActiveTripList && !hasPastTrips;

  return {
    currentTrips: data.currentTrips || [],
    futureTrips: data.futureTrips || [],
    pastTrips: data.pastTrips || [],
    trips: data.allTrips || [],
    isLoading: false,
    noTripList,
    noActiveTripList,
    hasPastTrips,
    error: error?.message || null,
  };
}
