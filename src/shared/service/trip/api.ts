import dayjs from "dayjs";
import { deleteExpensesByScheduleIds } from "@/features/expense/services/api";
import { supabase } from "../supabase/cilent";

export interface OutOfRangeSchedule {
  id: string;
  day_number: number;
  place_name: string;
}

// 범위 밖 일정 조회
export const getSchedulesOutOfRange = async (
  tripId: string,
  maxDayNumber: number,
): Promise<OutOfRangeSchedule[]> => {
  const { data, error } = await supabase
    .from("trip_schedules")
    .select("id, day_number, place_name")
    .eq("trip_id", tripId)
    .gt("day_number", maxDayNumber);

  if (error) {
    throw new Error(`범위 밖 일정 조회 실패: ${error.message}`);
  }

  return data || [];
};

// 일정 날짜 일괄 업데이트
export const updateScheduleDates = async (
  tripId: string,
  newStartDate: string,
): Promise<void> => {
  // 해당 여행의 모든 일정 조회
  const { data: schedules, error: fetchError } = await supabase
    .from("trip_schedules")
    .select("id, day_number")
    .eq("trip_id", tripId);

  if (fetchError) {
    throw new Error(`일정 조회 실패: ${fetchError.message}`);
  }

  if (!schedules || schedules.length === 0) {
    return;
  }

  // 각 일정의 schedule_date를 새 시작일 기준으로 재 배치
  const updatePromises = schedules.map((schedule) => {
    const newScheduleDate = dayjs(newStartDate)
      .add(schedule.day_number - 1, "day")
      .format("YYYY-MM-DD");

    return supabase
      .from("trip_schedules")
      .update({ schedule_date: newScheduleDate })
      .eq("id", schedule.id);
  });

  const results = await Promise.all(updatePromises);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw new Error(
      `일정 날짜 업데이트 실패: ${errors.map((e) => e.error?.message).join(", ")}`,
    );
  }
};

// 범위 밖 경비 삭제 (일정에 연결되지 않은 경비)
export const deleteExpensesOutOfRange = async (
  tripId: string,
  maxDayNumber: number,
): Promise<number> => {
  const { count, error } = await supabase
    .from("trip_expenses")
    .delete({ count: "exact" })
    .eq("trip_id", tripId)
    .gt("day_number", maxDayNumber)
    .is("schedule_id", null);

  if (error) {
    throw new Error(`범위 밖 경비 삭제 실패: ${error.message}`);
  }

  return count ?? 0;
};

// 경비 날짜 일괄 업데이트 (expense_date 재배치)
export const updateExpenseDates = async (
  tripId: string,
  newStartDate: string,
): Promise<void> => {
  // 해당 여행의 모든 경비 조회
  const { data: expenses, error: fetchError } = await supabase
    .from("trip_expenses")
    .select("id, day_number")
    .eq("trip_id", tripId);

  if (fetchError) {
    throw new Error(`경비 조회 실패: ${fetchError.message}`);
  }

  if (!expenses || expenses.length === 0) {
    return;
  }

  // 각 경비의 expense_date를 새 시작일 기준으로 재계산하여 업데이트
  const updatePromises = expenses.map((expense) => {
    const newExpenseDate = dayjs(newStartDate)
      .add(expense.day_number - 1, "day")
      .format("YYYY-MM-DD");

    return supabase
      .from("trip_expenses")
      .update({ expense_date: newExpenseDate })
      .eq("id", expense.id);
  });

  const results = await Promise.all(updatePromises);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw new Error(
      `경비 날짜 업데이트 실패: ${errors.map((e) => e.error?.message).join(", ")}`,
    );
  }
};

// 여행 기간 수정 + 일정 조정 통합 API
export const updateTripDatesWithSchedules = async (params: {
  tripId: string;
  startDate: string;
  endDate: string;
  deleteOutOfRangeSchedules: boolean;
}): Promise<{ deletedScheduleCount: number }> => {
  const { tripId, startDate, endDate, deleteOutOfRangeSchedules } = params;
  let deletedScheduleCount = 0;

  // 새 여행 기간 계산
  const newDuration = dayjs(endDate).diff(dayjs(startDate), "day") + 1;

  // 1. 범위 밖 일정 및 경비 처리
  if (deleteOutOfRangeSchedules) {
    const outOfRangeSchedules = await getSchedulesOutOfRange(
      tripId,
      newDuration,
    );

    if (outOfRangeSchedules.length > 0) {
      const scheduleIds = outOfRangeSchedules.map((s) => s.id);

      // 연결된 경비 먼저 삭제
      await deleteExpensesByScheduleIds(scheduleIds);

      // 일정 삭제
      const { error: deleteError } = await supabase
        .from("trip_schedules")
        .delete()
        .in("id", scheduleIds);

      if (deleteError) {
        throw new Error(`범위 밖 일정 삭제 실패: ${deleteError.message}`);
      }

      deletedScheduleCount = outOfRangeSchedules.length;
    }

    // 일정에 연결되지 않은 범위 밖 독립 경비도 삭제
    await deleteExpensesOutOfRange(tripId, newDuration);
  }

  // 2+3. 남은 일정/경비의 날짜 병렬 재계산
  await Promise.all([
    updateScheduleDates(tripId, startDate),
    updateExpenseDates(tripId, startDate),
  ]);

  // 4. trips 테이블 업데이트
  const { error: updateError } = await supabase
    .from("trips")
    .update({
      start_date: startDate,
      end_date: endDate,
    })
    .eq("id", tripId);

  if (updateError) {
    throw new Error(`여행 기간 수정 실패: ${updateError.message}`);
  }

  return { deletedScheduleCount };
};

// 여행명을 수정하는 API
export const updateTripTitle = async (
  tripId: string,
  newTitle: string,
): Promise<void> => {
  const title = newTitle.trim();
  if (!title) {
    throw new Error("여행명을 입력해주세요.");
  }

  if (title.length > 50) {
    throw new Error("여행명은 50자 이하로 입력해주세요.");
  }

  const { error } = await supabase
    .from("trips")
    .update({
      title: title,
    })
    .eq("id", tripId);

  if (error) {
    throw new Error(`여행명 수정 실패: ${error.message}`);
  }
};

// 여행 기간을 수정하는 API
export const updateTripDates = async (
  tripId: string,
  startDate: string,
  endDate: string,
): Promise<void> => {
  if (!startDate || !endDate) {
    throw new Error("여행 시작일과 종료일을 모두 선택해주세요.");
  }

  const { error } = await supabase
    .from("trips")
    .update({
      start_date: startDate,
      end_date: endDate,
    })
    .eq("id", tripId);

  if (error) {
    throw new Error(`여행 기간 수정 실패: ${error.message}`);
  }
};
// 여행을 삭제하는 API
export const deleteTrip = async (tripId: string): Promise<void> => {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);

  if (error) {
    throw new Error(`여행 삭제 실패: ${error.message}`);
  }
};

// 여행 이미지 URL 업데이트 API
export const updateTripImageUrl = async (
  tripId: string,
  imageUrl: string | null,
): Promise<void> => {
  const { error } = await supabase
    .from("trips")
    .update({ image_url: imageUrl })
    .eq("id", tripId);

  if (error) {
    throw new Error(`이미지 URL 업데이트 실패: ${error.message}`);
  }
};

// 여행 메모 업데이트 API
export const updateTripMemo = async (
  tripId: string,
  memo: string | null,
): Promise<void> => {
  const { error } = await supabase
    .from("trips")
    .update({ memo })
    .eq("id", tripId);

  if (error) {
    throw new Error(`메모 저장 실패: ${error.message}`);
  }
};
