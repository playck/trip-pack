import type { FlightApiResponse, FlightStatusItem } from "../types";

const API_KEY = import.meta.env.VITE_DATA_GO_KR_API_KEY || "";
const FLIGHT_BASE_URL =
  "https://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp";

interface SearchParams {
  flightId?: string;
  airline?: string;
  from_time?: string;
  to_time?: string;
}

// 출발편 조회
export const getPassengerDepartures = async (
  params: SearchParams = {},
): Promise<FlightStatusItem[]> => {
  return fetchFlightStatus("getPassengerDeparturesOdp", params);
};

// 도착편 조회
export const getPassengerArrivals = async (
  params: SearchParams = {},
): Promise<FlightStatusItem[]> => {
  return fetchFlightStatus("getPassengerArrivalsOdp", params);
};

// 편명으로 운항 현황 조회 (출발/도착 자동 판별)
export const getFlightStatus = async (
  flightId: string,
  type: "departure" | "return",
): Promise<FlightStatusItem | null> => {
  const cleanFlightId = flightId.trim().toUpperCase();

  // 출발편이면 departures(ICN에서 출발), 리턴편이면 arrivals(ICN에 도착)
  const items =
    type === "departure"
      ? await getPassengerDepartures({ flightId: cleanFlightId })
      : await getPassengerArrivals({ flightId: cleanFlightId });

  if (!items.length) return null;

  // 정확히 일치하거나 접미사(Y 등)가 붙은 편명 찾기
  return (
    items.find((item) => item.flightId.toUpperCase() === cleanFlightId) ||
    items.find((item) =>
      item.flightId.toUpperCase().startsWith(cleanFlightId),
    ) ||
    items[0]
  );
};

// 검색 결과 + 출발/도착 타입 포함
export interface FlightSearchResult extends FlightStatusItem {
  _flightType: "departure" | "return";
}

// 편명으로 항공편 검색 (출발/도착 양쪽 동시 조회)
export const searchFlightsBoth = async (
  flightId: string,
): Promise<FlightSearchResult[]> => {
  const cleanFlightId = flightId.trim().toUpperCase();

  const [departures, arrivals] = await Promise.all([
    getPassengerDepartures({ flightId: cleanFlightId }).catch(() => []),
    getPassengerArrivals({ flightId: cleanFlightId }).catch(() => []),
  ]);

  const results: FlightSearchResult[] = [
    ...departures.map((item) => ({
      ...item,
      _flightType: "departure" as const,
    })),
    ...arrivals.map((item) => ({ ...item, _flightType: "return" as const })),
  ];

  return results;
};

async function fetchFlightStatus(
  endpoint: string,
  params: SearchParams,
): Promise<FlightStatusItem[]> {
  if (!API_KEY) {
    throw new Error(
      "인천공항 API 키가 설정되지 않았습니다. VITE_DATA_GO_KR_API_KEY를 확인해주세요.",
    );
  }

  // serviceKey는 이미 URL 인코딩된 값이므로 직접 쿼리스트링을 조합
  const queryParts = [`serviceKey=${API_KEY}`, `type=json`, `numOfRows=100`];

  if (params.flightId)
    queryParts.push(`flight_id=${encodeURIComponent(params.flightId)}`);

  if (params.airline)
    queryParts.push(`airline=${encodeURIComponent(params.airline)}`);

  if (params.from_time) queryParts.push(`from_time=${params.from_time}`);
  if (params.to_time) queryParts.push(`to_time=${params.to_time}`);

  const url = `${FLIGHT_BASE_URL}/${endpoint}?${queryParts.join("&")}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`항공편 조회 실패: ${res.status}`);
  }

  const data: FlightApiResponse = await res.json();

  if (data.response.header.resultCode !== "00") {
    throw new Error(`API 오류: ${data.response.header.resultMsg}`);
  }

  const items = data.response.body.items;

  if (!Array.isArray(items)) {
    return items ? [items as unknown as FlightStatusItem] : [];
  }

  return items;
}
