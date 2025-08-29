import { useQuery } from "@tanstack/react-query";
import { getTripList } from "./api";
import type { Trip } from "../types";

export interface UseTripListReturn {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
}

export function useTripList(): UseTripListReturn {
  const {
    data: trips = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tripList"],
    queryFn: getTripList,
    retry: false,
  });

  return {
    trips,
    isLoading,
    error: error?.message || null,
  };
}
