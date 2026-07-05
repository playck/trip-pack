import { useQuery } from "@tanstack/react-query";
import type { ParkingAirport } from "../types";
import { getGimpoParkingStatus, getParkingStatus } from "./parkingApi";

// 공항별 주차장 실시간 현황 조회 (인천=IIAC API, 김포=KAC API)
// staleTime 5분 = 공공데이터 갱신 주기와 일치 (캐싱 비용 전략 준수).
// 자동 폴링(refetchInterval)은 두지 않음 — 모달/시트는 잠깐 보고 닫는 화면이라
//  갱신은 새로고침 버튼 + 재오픈(stale 시 자동)에 맡긴다.
export const useParkingStatus = (airport: ParkingAirport = "ICN") => {
  return useQuery({
    queryKey: ["airportParking", airport],
    queryFn: ({ signal }) =>
      airport === "GMP"
        ? getGimpoParkingStatus(signal)
        : getParkingStatus(signal),
    staleTime: 1000 * 60 * 5,
  });
};
