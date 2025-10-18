import { supabase } from "@/shared/service/supabase/cilent";
import type { CreateScheduleParams, Schedule, ScheduleInsert } from "../types";

/**
 * 일정 생성
 */
export const createSchedule = async (
  params: CreateScheduleParams
): Promise<{ id: string }> => {
  const insertData: ScheduleInsert = {
    trip_id: params.tripId,
    day_number: params.dayNumber,
    schedule_date: params.scheduleDate,
    place_id: params.placeId,
    place_name: params.placeName,
    place_address: params.placeAddress || null,
    latitude: params.latitude || null,
    longitude: params.longitude || null,
    visit_order: params.visitOrder,
    start_time: params.startTime || null,
    notes: params.notes || null,
    category: params.category || null,
  };

  const { data, error } = await supabase
    .from("trip_schedules")
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    console.error("일정 생성 실패:", error);
    throw new Error(`일정 추가에 실패했습니다: ${error.message}`);
  }

  if (!data) {
    throw new Error("일정이 생성되지 않았습니다");
  }

  return { id: data.id };
};

/**
 * 여행의 일정 목록 조회
 */
export const getTripSchedules = async (tripId: string): Promise<Schedule[]> => {
  const { data, error } = await supabase
    .from("trip_schedules")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_number", { ascending: true })
    .order("visit_order", { ascending: true });

  if (error) {
    console.error("일정 조회 실패:", error);
    throw new Error(`일정을 불러올 수 없습니다: ${error.message}`);
  }

  return data || [];
};

/**
 * 특정 일차의 마지막 visit_order 조회
 */
export const getLastVisitOrder = async (
  tripId: string,
  dayNumber: number
): Promise<number> => {
  const { data, error } = await supabase
    .from("trip_schedules")
    .select("visit_order")
    .eq("trip_id", tripId)
    .eq("day_number", dayNumber)
    .order("visit_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("마지막 순서 조회 실패:", error);
    return 0;
  }

  return data?.visit_order || 0;
};

/**
 * 일정 삭제
 */
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  const { error } = await supabase
    .from("trip_schedules")
    .delete()
    .eq("id", scheduleId);

  if (error) {
    console.error("일정 삭제 실패:", error);
    throw new Error(`일정 삭제에 실패했습니다: ${error.message}`);
  }
};
