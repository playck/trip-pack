import { supabase } from "@/shared/service/supabase/cilent";
import {
  deleteExpensesByScheduleId,
  deleteExpensesByScheduleIds,
} from "@/features/expense/services/api";
import { getDayDate } from "@/shared/utiles/date";
import type {
  CreateScheduleParams,
  Schedule,
  ScheduleInsert,
  UpdateScheduleParams,
} from "../types";

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
    return 0;
  }

  return data?.visit_order || 0;
};

/**
 * 일정 삭제 (연결된 경비도 함께 삭제)
 */
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  // 연결된 경비 먼저 삭제
  await deleteExpensesByScheduleId(scheduleId);

  const { error } = await supabase
    .from("trip_schedules")
    .delete()
    .eq("id", scheduleId);

  if (error) {
    throw new Error(`일정 삭제에 실패했습니다: ${error.message}`);
  }
};

/**
 * 일정 일괄 삭제 (연결된 경비도 함께 삭제)
 */
export const deleteBulkSchedules = async (
  scheduleIds: string[]
): Promise<void> => {
  if (scheduleIds.length === 0) {
    return;
  }

  // 연결된 경비 먼저 삭제
  await deleteExpensesByScheduleIds(scheduleIds);

  const { error } = await supabase
    .from("trip_schedules")
    .delete()
    .in("id", scheduleIds);

  if (error) {
    throw new Error(`일정 삭제에 실패했습니다: ${error.message}`);
  }
};

/**
 * 단일 일정 조회
 */
export const getScheduleById = async (
  scheduleId: string
): Promise<Schedule> => {
  const { data, error } = await supabase
    .from("trip_schedules")
    .select("*")
    .eq("id", scheduleId)
    .single();

  if (error) {
    throw new Error(`일정을 불러올 수 없습니다: ${error.message}`);
  }

  if (!data) {
    throw new Error("일정을 찾을 수 없습니다");
  }

  return data;
};

/**
 * 일정 수정
 */
export const updateSchedule = async (
  params: Omit<UpdateScheduleParams, "scheduleId"> & {
    scheduleId: string;
  }
): Promise<void> => {
  const { scheduleId, ...updateData } = params;

  const fieldMapping: Record<string, string> = {
    placeName: "place_name",
    placeAddress: "place_address",
    latitude: "latitude",
    longitude: "longitude",
    startTime: "start_time",
    durationMinutes: "duration_minutes",
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
    .from("trip_schedules")
    .update(updatesFields)
    .eq("id", scheduleId);

  if (error) {
    throw new Error(`일정 수정에 실패했습니다: ${error.message}`);
  }
};

/**
 * 일정 순서 일괄 업데이트
 */
export const updateScheduleOrder = async (
  updates: Array<{ id: string; visitOrder: number }>
): Promise<void> => {
  const updatePromises = updates.map(({ id, visitOrder }) =>
    supabase
      .from("trip_schedules")
      .update({ visit_order: visitOrder })
      .eq("id", id)
  );

  const results = await Promise.all(updatePromises);

  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw new Error(
      `일정 순서 업데이트 실패: ${errors.map((e) => e.error?.message).join(", ")}`
    );
  }
};

/**
 * 일정을 다른 일차 일정으로 업데이트 (연동된 경비도 함께 이동)
 */
export const moveSchedulesToDay = async (params: {
  scheduleIds: string[];
  targetDayNumber: number;
  tripId: string;
  tripStartDate: string;
}): Promise<void> => {
  const { scheduleIds, targetDayNumber, tripId, tripStartDate } = params;

  if (scheduleIds.length === 0) {
    return;
  }

  const lastOrder = await getLastVisitOrder(tripId, targetDayNumber);

  // 1. 일정 이동
  const updatePromises = scheduleIds.map((id, index) =>
    supabase
      .from("trip_schedules")
      .update({
        day_number: targetDayNumber,
        visit_order: lastOrder + index + 1,
        schedule_date: getDayDate(tripStartDate, targetDayNumber),
      })
      .eq("id", id)
  );

  const results = await Promise.all(updatePromises);

  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw new Error(
      `일정 이동 실패: ${errors.map((e) => e.error?.message).join(", ")}`
    );
  }

  // 2. 연동된 경비 날짜도 함께 이동
  const targetExpenseDate = getDayDate(tripStartDate, targetDayNumber);

  const { error: expenseError } = await supabase
    .from("trip_expenses")
    .update({
      day_number: targetDayNumber,
      expense_date: targetExpenseDate,
    })
    .in("schedule_id", scheduleIds);

  if (expenseError) {
    throw new Error(`연동 경비 이동 실패: ${expenseError.message}`);
  }
};
