import { supabase } from "../supabase/cilent";

// 여행명을 수정하는 API
export const updateTripTitle = async (
  tripId: string,
  newTitle: string
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
  endDate: string
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
