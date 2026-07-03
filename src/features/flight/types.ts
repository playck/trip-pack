// 등록된 항공편 (데이터베이스 저장용)
export interface TripFlight {
  id: string;
  trip_id: string;
  flight_id: string;
  airline: string;
  departure_airport: string;
  arrival_airport: string;
  scheduled_date: string;
  scheduled_time: string | null;
  flight_type: "departure" | "return";
  created_at: string | null;
}

export type TripFlightInsert = Omit<TripFlight, "id" | "created_at">;

// 인천공항 API 응답 타입
export interface FlightStatusItem {
  airline: string;
  flightId: string;
  scheduleDateTime: string; // "HHMM" (4자리, e.g. "0615")
  estimatedDateTime: string;
  airport: string;
  airportCode: string;
  cityCode: string;
  gatenumber: string;
  chkinrange: string; // 체크인 카운터 (출발편)
  carousel: string; // 수하물 수취대 (도착편)
  exitnumber: string; // 출구 (도착편)
  terminalId: string;
  remark: string;
  codeshare: string;
  masterflightid: string;
  typeOfFlight: string;
}

export interface FlightApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: FlightStatusItem[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export const REMARK_COLORS: Record<string, { bg: string; text: string }> = {
  출발: { bg: "#E6FFFA", text: "#2C7A7B" },
  도착: { bg: "#E6FFFA", text: "#2C7A7B" },
  지연: { bg: "#FFFBEB", text: "#D69E2E" },
  결항: { bg: "#FFF1F2", text: "#E11D48" },
  탑승중: { bg: "#EBF8FF", text: "#2B6CB0" },
  마감: { bg: "#F7FAFC", text: "#718096" },
  탑승준비: { bg: "#EBF8FF", text: "#2B6CB0" },
  회항: { bg: "#FFF1F2", text: "#E11D48" },
};

export const TERMINAL_NAMES: Record<string, string> = {
  P01: "제1터미널",
  P02: "제2터미널",
  P03: "탑승동",
};

// 등록 시 선택 가능한 국내 공항 (코드 → 표시명)
export const AIRPORT_NAMES: Record<string, string> = {
  ICN: "인천",
  GMP: "김포",
};
