import { useQuery } from "@tanstack/react-query";
import type { ParkingAirport } from "../types";
import { getGimpoParkingStatus, getParkingStatus } from "./parkingApi";

// 공항별 주차장 실시간 현황 조회 (인천=IIAC API, 김포=KAC API)
// staleTime/refetchInterval 5분 = 공공데이터 갱신 주기와 일치 (캐싱 비용 전략 준수)
export const useParkingStatus = (airport: ParkingAirport = "ICN") => {
  return useQuery({
    queryKey: ["airportParking", airport],
    queryFn: ({ signal }) =>
      airport === "GMP"
        ? getGimpoParkingStatus(signal)
        : getParkingStatus(signal),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};
