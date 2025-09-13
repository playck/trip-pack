import { supabase } from "./supabase/cilent";

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
