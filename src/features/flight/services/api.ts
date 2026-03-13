import { supabase } from "@/shared/service/supabase/cilent";
import type { TripFlight, TripFlightInsert } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flightsTable = () => (supabase as any).from("trip_flights");

// 여행의 등록된 항공편 목록 조회
export const getTripFlights = async (
  tripId: string
): Promise<TripFlight[]> => {
  const { data, error } = await flightsTable()
    .select("*")
    .eq("trip_id", tripId)
    .order("flight_type", { ascending: true });

  if (error) {
    throw new Error(`항공편 조회 실패: ${error.message}`);
  }

  return (data as TripFlight[]) || [];
};

// 항공편 등록 (UNIQUE 제약조건으로 upsert 처리)
export const createTripFlight = async (
  flight: TripFlightInsert
): Promise<TripFlight> => {
  const { data, error } = await flightsTable()
    .upsert(flight, { onConflict: "trip_id,flight_type" })
    .select()
    .single();

  if (error) {
    throw new Error(`항공편 등록 실패: ${error.message}`);
  }

  return data as TripFlight;
};

// 항공편 삭제
export const deleteTripFlight = async (flightId: string): Promise<void> => {
  const { error } = await flightsTable()
    .delete()
    .eq("id", flightId);

  if (error) {
    throw new Error(`항공편 삭제 실패: ${error.message}`);
  }
};
