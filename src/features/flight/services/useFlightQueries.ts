import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { getTripFlights, createTripFlight, deleteTripFlight } from "./api";
import { getFlightStatus } from "./flightApi";
import type { TripFlight, TripFlightInsert, FlightStatusItem } from "../types";

// 등록된 항공편 목록 조회
export const useTripFlights = (tripId: string) => {
  return useQuery({
    queryKey: ["tripFlights", tripId],
    queryFn: () => getTripFlights(tripId),
    staleTime: 1000 * 60 * 5,
    enabled: !!tripId,
    meta: { persist: true }, // 오프라인 읽기: 여행 윈도우 내 항공편 목록 persist
  });
};

// 실시간 운항 현황 조회
export const useFlightStatus = (flight: TripFlight | undefined) => {
  return useQuery<FlightStatusItem | null>({
    queryKey: ["flightStatus", flight?.flight_id, flight?.flight_type],
    queryFn: () => getFlightStatus(flight!.flight_id, flight!.flight_type),
    enabled: !!flight,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
};

// 항공편 등록
export const useCreateFlight = (tripId: string, isEdit = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flight: TripFlightInsert) => createTripFlight(flight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripFlights", tripId] });
      toaster.create({
        title: isEdit
          ? "항공편이 수정되었습니다"
          : "항공편이 등록되었습니다",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: isEdit ? "항공편 수정 실패" : "항공편 등록 실패",
        description: error.message,
        type: "error",
      });
    },
  });
};

// 항공편 삭제
export const useDeleteFlight = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flightId: string) => deleteTripFlight(flightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripFlights", tripId] });
      toaster.create({
        title: "항공편이 삭제되었습니다",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "항공편 삭제 실패",
        description: error.message,
        type: "error",
      });
    },
  });
};
