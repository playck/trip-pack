import { useQuery } from "@tanstack/react-query";
import { getTripList } from "./api";
import type { Trip, TripListData } from "../types";

export interface UseTripListReturn {
  currentTrips: Trip[] | null;
  futureTrips: Trip[];
  pastTrips: Trip[];
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
}

export function useTripList(): UseTripListReturn {
  const { data, isLoading, error } = useQuery<TripListData>({
    queryKey: ["tripList"],
    queryFn: getTripList,
    retry: false,
  });

  return {
    currentTrips: data?.currentTrips || [],
    futureTrips: data?.futureTrips || [],
    pastTrips: data?.pastTrips || [],
    trips: data?.allTrips || [],
    isLoading,
    error: error?.message || null,
  };
}
