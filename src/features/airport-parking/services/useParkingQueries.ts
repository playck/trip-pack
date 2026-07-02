import { useQuery } from "@tanstack/react-query";
import { getParkingStatus } from "./parkingApi";

// 인천공항 주차장 실시간 현황 조회
// staleTime/refetchInterval 5분 = 공공데이터 갱신 주기와 일치 (캐싱 비용 전략 준수)
export const useParkingStatus = () => {
  return useQuery({
    queryKey: ["airportParking"],
    queryFn: ({ signal }) => getParkingStatus(signal),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};
