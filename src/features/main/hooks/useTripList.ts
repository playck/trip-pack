import { useSuspenseQuery } from "@tanstack/react-query";
import { getTripList } from "./api";
import type { Trip, TripListData } from "../types";

export interface UseTripListReturn {
  currentTrips: Trip[] | null;
  futureTrips: Trip[];
  pastTrips: Trip[];
  trips: Trip[];
  ownedTripCount: number;
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
    // 필드 추가 전에 저장된 오프라인 캐시엔 값이 없을 수 있다(재조회 전까지 0 → 서버 게이트가 최종 판단)
    ownedTripCount: data.ownedTripCount ?? 0,
    isLoading: false,
    noTripList,
    noActiveTripList,
    hasPastTrips,
    error: error?.message || null,
  };
}
