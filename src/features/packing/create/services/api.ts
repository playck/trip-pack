import { supabase } from "@/shared/service/supabase/cilent";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TablesInsert, Json } from "@/shared/types/database.type";

// 여행과 체크리스트를 함께 생성하는 트랜잭션 함수 (RPC)
export const createTripWithChecklist = async (
  tripData: TablesInsert<"trips">,
  categories: TablesInsert<"checklist_categories">[],
  items: TablesInsert<"checklist_items">[]
): Promise<string> => {
  const { data, error } = await (supabase as SupabaseClient).rpc(
    "create_trip_with_checklist",
    {
      p_trip_data: tripData as Json,
      p_categories: categories as Json,
      p_items: items as Json,
    }
  );

  if (error) {
    throw new Error(`여행 생성 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error("여행 생성 후 ID를 받을 수 없습니다.");
  }

  return data as string;
};
