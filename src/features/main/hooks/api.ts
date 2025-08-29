import { supabase } from "../../../shared/service/supabase/cilent";
import type { Trip } from "../types";

// 유저의 여행 목록을 가져오는 API
export const getTripList = async (): Promise<Trip[]> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`인증 오류: ${authError.message}`);
  }

  if (!user) {
    return [];
  }

  const { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("id, title, start_date, end_date, region_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (tripsError) {
    throw new Error(`여행 목록을 불러올 수 없습니다: ${tripsError.message}`);
  }

  return trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    start_date: trip.start_date,
    end_date: trip.end_date,
    region_name: trip.region_name,
  }));
};
