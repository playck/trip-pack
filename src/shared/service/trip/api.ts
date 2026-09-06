import { supabase } from "../supabase/cilent";

export interface OutOfRangeSchedule {
  id: string;
  day_number: number;
  place_name: string;
}

// 범위 밖 일정 조회 (기간 축소 시 "이 일정들을 지울까요?" 를 묻기 위한 목록)
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

// 여행 기간 수정 + 일정/경비/항공편 날짜 재배치 (update_trip_dates RPC)
//
// RPC로 수행. 실패하면 아무것도 바뀌지 않는다.
//
// 날짜 계산(start_date + day_number - 1)은 SQL 이 하므로 여기서 dayjs 가 필요 없다.
// 소유자만 호출할 수 있다. 예전에는 일반 멤버가 실행하면 일정·경비만 옮겨지고 여행 기간은
// 그대로인 채(trips UPDATE 0행은 오류가 아님) 성공으로 표시됐다.
export const updateTripDatesWithSchedules = async (params: {
  tripId: string;
  startDate: string;
  endDate: string;
  deleteOutOfRangeSchedules: boolean;
}): Promise<{ deletedScheduleCount: number }> => {
  const { tripId, startDate, endDate, deleteOutOfRangeSchedules } = params;

  // RPC는 생성된 타입에 아직 반영되지 않았을 수 있어 함수명 타입 회피
  const { data, error } = await (
    supabase.rpc as unknown as (
      fn: string,
      args: {
        p_trip_id: string;
        p_start_date: string;
        p_end_date: string;
        p_delete_out_of_range: boolean;
      },
    ) => Promise<{ data: number | null; error: { message: string } | null }>
  )("update_trip_dates", {
    p_trip_id: tripId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_delete_out_of_range: deleteOutOfRangeSchedules,
  });

  if (error) {
    if (error.message.includes("NOT_OWNER")) {
      throw new Error("여행 기간은 방장만 변경할 수 있습니다.");
    }
    if (error.message.includes("INVALID_RANGE")) {
      throw new Error("여행 종료일은 시작일보다 빠를 수 없습니다.");
    }
    throw new Error(`여행 기간 수정 실패: ${error.message}`);
  }

  return { deletedScheduleCount: data ?? 0 };
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

  const { data, error } = await supabase
    .from("trips")
    .update({ title })
    .eq("id", tripId)
    .select("id");

  if (error) {
    throw new Error(`여행명 수정 실패: ${error.message}`);
  }
  // RLS 가 막으면 예외가 아니라 "바뀐 행 없음" 이 온다. 성공으로 착각하지 않도록 여기서 끊는다.
  if (!data?.length) {
    throw new Error("여행명을 수정할 권한이 없습니다.");
  }
};

// 기간 변경은 updateTripDatesWithSchedules(= update_trip_dates RPC) 하나로만 한다.

// 여행을 삭제하는 API
export const deleteTrip = async (tripId: string): Promise<void> => {
  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId)
    .select("id");

  if (error) {
    throw new Error(`여행 삭제 실패: ${error.message}`);
  }
  // 삭제는 방장만 가능
  if (!data?.length) {
    throw new Error("여행 삭제는 방장만 할 수 있습니다.");
  }
};

// 여행 이미지 URL 업데이트 API
export const updateTripImageUrl = async (
  tripId: string,
  imageUrl: string | null,
): Promise<void> => {
  const { data, error } = await supabase
    .from("trips")
    .update({ image_url: imageUrl })
    .eq("id", tripId)
    .select("id");

  if (error) {
    throw new Error(`이미지 URL 업데이트 실패: ${error.message}`);
  }
  if (!data?.length) {
    throw new Error("여행 이미지를 변경할 권한이 없습니다.");
  }
};

// 여행 메모 업데이트 API
export const updateTripMemo = async (
  tripId: string,
  memo: string | null,
): Promise<void> => {
  const { data, error } = await supabase
    .from("trips")
    .update({ memo })
    .eq("id", tripId)
    .select("id");

  if (error) {
    throw new Error(`메모 저장 실패: ${error.message}`);
  }
  if (!data?.length) {
    throw new Error("여행 메모를 수정할 권한이 없습니다.");
  }
};
