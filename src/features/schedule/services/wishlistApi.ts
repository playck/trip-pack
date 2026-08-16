import { supabase } from "@/shared/service/supabase/cilent";
import { getDayDate } from "@/shared/utiles/date";
import { createSchedule, getLastVisitOrder, getScheduleById } from "./api";
import { isMemo } from "../utils/scheduleHelpers";
import type {
  CreateWishlistParams,
  UpdateWishlistParams,
  Wishlist,
  WishlistInsert,
} from "../types";

/**
 * 여행의 위시리스트(가고 싶은 곳) 목록 조회
 */
export const getTripWishlists = async (
  tripId: string
): Promise<Wishlist[]> => {
  const { data, error } = await supabase
    .from("trip_wishlists")
    .select("*")
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`가고 싶은 곳을 불러올 수 없습니다: ${error.message}`);
  }

  return data || [];
};

/**
 * 위시리스트의 마지막 sort_order 조회
 */
export const getLastSortOrder = async (tripId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("trip_wishlists")
    .select("sort_order")
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return 0;
  }

  return data?.sort_order || 0;
};

/**
 * 위시리스트 추가 (멱등)
 * - sort_order는 서버 조회 기준으로 계산한다 (여러 기기 동시 사용 시 캐시 충돌 방지)
 * - 같은 장소가 이미 담겨 있으면(trip_id+place_id 유니크) 새로 만들지 않고 기존 항목을 반환한다
 */
export const createWishlist = async (
  params: CreateWishlistParams
): Promise<{ id: string }> => {
  const lastOrder = await getLastSortOrder(params.tripId);

  const insertData: WishlistInsert = {
    trip_id: params.tripId,
    place_id: params.placeId,
    place_name: params.placeName,
    place_address: params.placeAddress || null,
    latitude: params.latitude || null,
    longitude: params.longitude || null,
    notes: params.notes || null,
    category: params.category || null,
    sort_order: lastOrder + 1,
  };

  const { data, error } = await supabase
    .from("trip_wishlists")
    .upsert(insertData, {
      onConflict: "trip_id,place_id",
      ignoreDuplicates: true,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`가고 싶은 곳 추가에 실패했습니다: ${error.message}`);
  }

  if (data) {
    return { id: data.id };
  }

  // 이미 담긴 장소 — 기존 항목 id 반환
  const { data: existing, error: existingError } = await supabase
    .from("trip_wishlists")
    .select("id")
    .eq("trip_id", params.tripId)
    .eq("place_id", params.placeId)
    .maybeSingle();

  if (existingError || !existing) {
    throw new Error("가고 싶은 곳이 저장되지 않았습니다");
  }

  return { id: existing.id };
};

/**
 * 위시리스트 수정
 */
export const updateWishlist = async (
  params: UpdateWishlistParams
): Promise<void> => {
  const { wishlistId, ...updateData } = params;

  const fieldMapping: Record<string, string> = {
    placeName: "place_name",
    notes: "notes",
    category: "category",
  };

  const updatesFields: Record<string, unknown> = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && key in fieldMapping) {
      updatesFields[fieldMapping[key]] = value;
    }
  });

  const { error } = await supabase
    .from("trip_wishlists")
    .update(updatesFields)
    .eq("id", wishlistId);

  if (error) {
    throw new Error(`가고 싶은 곳 수정에 실패했습니다: ${error.message}`);
  }
};

/**
 * 특정 장소의 위시리스트 항목 삭제 (배치 시 대기 목록 소비용)
 * 같은 장소가 여럿 담겨 있어도 모두 정리하고, 삭제된 개수를 반환한다
 */
export const deleteWishlistByPlaceId = async (
  tripId: string,
  placeId: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("trip_wishlists")
    .delete()
    .eq("trip_id", tripId)
    .eq("place_id", placeId)
    .select("id");

  if (error) {
    throw new Error(`가고 싶은 곳 정리에 실패했습니다: ${error.message}`);
  }

  return data?.length ?? 0;
};

/**
 * 위시리스트 삭제
 */
export const deleteWishlist = async (wishlistId: string): Promise<void> => {
  const { error } = await supabase
    .from("trip_wishlists")
    .delete()
    .eq("id", wishlistId);

  if (error) {
    throw new Error(`가고 싶은 곳 삭제에 실패했습니다: ${error.message}`);
  }
};

/**
 * 위시리스트 항목을 특정 일차의 일정으로 전환
 * 일정 생성이 성공한 뒤에만 위시리스트에서 제거한다 (실패 시 원본 보존)
 */
export const convertWishlistToSchedule = async (params: {
  wishlistId: string;
  tripId: string;
  dayNumber: number;
  tripStartDate: string;
}): Promise<{ id: string }> => {
  const { wishlistId, tripId, dayNumber, tripStartDate } = params;

  const { data: wishlist, error } = await supabase
    .from("trip_wishlists")
    .select("*")
    .eq("id", wishlistId)
    .single();

  if (error || !wishlist) {
    throw new Error("가고 싶은 곳을 찾을 수 없습니다");
  }

  const lastOrder = await getLastVisitOrder(tripId, dayNumber);

  const created = await createSchedule({
    tripId,
    dayNumber,
    scheduleDate: getDayDate(tripStartDate, dayNumber),
    placeId: wishlist.place_id,
    placeName: wishlist.place_name,
    placeAddress: wishlist.place_address ?? undefined,
    latitude: wishlist.latitude ?? undefined,
    longitude: wishlist.longitude ?? undefined,
    visitOrder: lastOrder + 1,
    notes: wishlist.notes ?? undefined,
    category: wishlist.category ?? undefined,
  });

  await deleteWishlist(wishlistId);

  return created;
};

/**
 * 일정을 위시리스트로 되돌리기
 * - 위시리스트 생성이 성공한 뒤에만 일정을 제거한다 (실패 시 원본 보존)
 * - 일정 행만 삭제하므로 연동 경비는 남고 schedule_id 연결만 해제된다
 *   (trip_expenses_schedule_id_fkey ON DELETE SET NULL)
 */
export const convertScheduleToWishlist = async (params: {
  scheduleId: string;
}): Promise<{ id: string }> => {
  const schedule = await getScheduleById(params.scheduleId);

  if (isMemo(schedule)) {
    throw new Error("메모는 가고 싶은 곳으로 옮길 수 없습니다");
  }

  const created = await createWishlist({
    tripId: schedule.trip_id,
    placeId: schedule.place_id,
    placeName: schedule.place_name,
    placeAddress: schedule.place_address ?? undefined,
    latitude: schedule.latitude ?? undefined,
    longitude: schedule.longitude ?? undefined,
    notes: schedule.notes ?? undefined,
    category: schedule.category ?? undefined,
  });

  const { error } = await supabase
    .from("trip_schedules")
    .delete()
    .eq("id", params.scheduleId);

  if (error) {
    throw new Error(`일정 이동에 실패했습니다: ${error.message}`);
  }

  return created;
};
