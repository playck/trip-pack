import { supabase } from "./supabase/cilent";

export interface TripInfo {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  regionName: string | null;
  countryCode: string | null;
  companionType: string | null;
  companionTypes: string[] | null;
  tripTypes: string[] | null;
}

// 여행 정보 조회 API
export const getTripInfo = async (tripId: string): Promise<TripInfo | null> => {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        id,
        title,
        start_date,
        end_date,
        region_name,
        country_code,
        companion_type,
        companion_types,
        trip_types
      `
      )
      .eq("id", tripId)
      .single();

    if (error) {
      console.error("여행 정보 조회 에러:", error);
      return null;
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
      countryCode: data.country_code,
      companionType: data.companion_type,
      companionTypes: data.companion_types as string[] | null,
      tripTypes: data.trip_types as string[] | null,
    };
  } catch (error) {
    console.error("여행 정보 조회 실패:", error);
    return null;
  }
};
