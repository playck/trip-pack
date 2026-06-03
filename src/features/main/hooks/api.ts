import dayjs from "dayjs";
import { supabase } from "../../../shared/service/supabase/cilent";
import type { Trip, TripListData } from "../types";

// 유저의 여행 목록을 가져오는 API
export const getTripList = async (): Promise<TripListData> => {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (authError) {
    throw new Error(`인증 오류: ${authError.message}`);
  }

  if (!user) {
    return {
      currentTrips: null,
      futureTrips: [],
      pastTrips: [],
      allTrips: [],
    };
  }

  const today = dayjs().format("YYYY-MM-DD");

  // 소유 + 초대받은 여행 ID 목록 조회
  const { data: tripIds, error: rpcError } =
    await supabase.rpc("get_my_trip_ids");

  if (rpcError) {
    throw new Error(`여행 ID 목록 조회 오류: ${rpcError.message}`);
  }

  if (!tripIds || tripIds.length === 0) {
    return {
      currentTrips: null,
      futureTrips: [],
      pastTrips: [],
      allTrips: [],
    };
  }

  // 현재 여행 (시작일 <= 오늘 < 종료일 또는 종료일이 null)
  const { data: currentTrips, error: currentError } = await supabase
    .from("trips")
    .select(
      "id, title, start_date, end_date, region_name, budget, country_code, image_url"
    )
    .in("id", tripIds)
    .lte("start_date", today)
    .or(`end_date.gte.${today},end_date.is.null`)
    .order("start_date", { ascending: true });

  if (currentError) {
    throw new Error(
      `여행중인 목록을 불러올 수 없습니다: ${currentError.message}`
    );
  }

  // 미래 여행 (시작일 > 오늘)
  const { data: futureTrips, error: futureError } = await supabase
    .from("trips")
    .select(
      "id, title, start_date, end_date, region_name, budget, country_code, image_url"
    )
    .in("id", tripIds)
    .gt("start_date", today)
    .order("start_date", { ascending: true });

  if (futureError) {
    throw new Error(
      `예정된 여행 목록을 불러올 수 없습니다: ${futureError.message}`
    );
  }

  // 과거 여행 (종료일 < 오늘 또는 시작일 < 오늘 && 종료일이 null)
  const { data: pastTrips, error: pastError } = await supabase
    .from("trips")
    .select(
      "id, title, start_date, end_date, region_name, budget, country_code, image_url"
    )
    .in("id", tripIds)
    .or(`end_date.lt.${today},and(start_date.lt.${today},end_date.is.null)`)
    .not("start_date", "gte", today)
    .order("start_date", { ascending: false });

  if (pastError) {
    throw new Error(
      `지난 여행 목록을 불러올 수 없습니다: ${pastError.message}`
    );
  }

  const allTrip = (trip: Trip): Trip => ({
    id: trip.id,
    title: trip.title,
    start_date: trip.start_date,
    end_date: trip.end_date,
    region_name: trip.region_name,
    budget: trip.budget,
    country_code: trip.country_code,
    image_url: trip.image_url,
  });

  const mappedCurrentTrips = (currentTrips || []).map(allTrip);
  const mappedFutureTrips = (futureTrips || []).map(allTrip);
  const mappedPastTrips = (pastTrips || []).map(allTrip);

  return {
    currentTrips: mappedCurrentTrips,
    futureTrips: mappedFutureTrips,
    pastTrips: mappedPastTrips,
    allTrips: [...mappedCurrentTrips, ...mappedFutureTrips, ...mappedPastTrips],
  };
};

// 여행 상세 정보 가져오기
export const getTripDetail = async (tripId: string): Promise<Trip> => {
  const { data, error } = await supabase
    .from("trips")
    .select(
      "id, title, start_date, end_date, region_name, budget, country_code, image_url"
    )
    .eq("id", tripId)
    .single();

  if (error) {
    throw new Error(`여행 정보를 불러올 수 없습니다: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    start_date: data.start_date,
    end_date: data.end_date,
    region_name: data.region_name,
    budget: data.budget,
    country_code: data.country_code,
    image_url: data.image_url,
  };
};
