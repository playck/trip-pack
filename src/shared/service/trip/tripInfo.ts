import { supabase } from "../supabase/cilent";

export interface TripInfo {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  regionName: string | null;
  regionId: string | null;
  countryCode: string | null;
  companionType: string | null;
  companionTypes: string[] | null;
  tripTypes: string[] | null;
  budget: number | null;
  imageUrl: string | null;
  memo: string | null;
}

// 여행 정보 조회 API
// null은 "여행이 없거나 볼 권한이 없음"(0행)일 때만 — 호출부가 홈으로 보내는 신호다.
// 네트워크 오류까지 null로 돌려주면 5분간 정상 값으로 캐시돼 화면이 튕기거나 빈다.
export const getTripInfo = async (tripId: string): Promise<TripInfo | null> => {
  const { data, error } = await supabase
    .from("trips")
    .select(
      `
      id,
      title,
      start_date,
      end_date,
      region_name,
      region_id,
      country_code,
      companion_type,
      companion_types,
      trip_types,
      budget,
      image_url,
      memo
    `,
    )
    .eq("id", tripId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`여행 정보를 불러오지 못했습니다: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title || "여행",
    startDate: data.start_date,
    endDate: data.end_date || "",
    regionName: data.region_name,
    regionId: data.region_id,
    countryCode: data.country_code,
    companionType: data.companion_type,
    companionTypes: data.companion_types as string[] | null,
    tripTypes: data.trip_types as string[] | null,
    budget: data.budget,
    imageUrl: data.image_url,
    memo: data.memo ?? null,
  };
};

// 여행 예산 업데이트 API
export const updateTripBudget = async (
  tripId: string,
  budget: number | null,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("trips")
      .update({ budget })
      .eq("id", tripId)
      .select("id");

    if (error) {
      console.error("여행 예산 업데이트 에러:", error);
      return false;
    }

    // 예산은 방장만 바꿀 수 있다.
    if (!data?.length) {
      console.error("여행 예산 업데이트 거부: 권한 없음 (방장만 가능)");
      return false;
    }

    return true;
  } catch (error) {
    console.error("여행 예산 업데이트 실패:", error);
    return false;
  }
};
