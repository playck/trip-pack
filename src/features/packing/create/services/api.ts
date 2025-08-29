import { supabase } from "@/shared/service/supabase/cilent";
import type { TablesInsert } from "@/shared/types/database.type";

// 여행 생성 API
export const createTrip = async (tripData: TablesInsert<"trips">) => {
  const { data, error } = await supabase
    .from("trips")
    .insert(tripData)
    .select("id")
    .single();

  if (error) {
    throw new Error(`여행 생성 실패: ${error.message} (코드: ${error.code})`);
  }

  return data.id;
};

// 체크리스트 카테고리 생성 API
export const createChecklistCategories = async (
  categories: TablesInsert<"checklist_categories">[]
) => {
  if (categories.length === 0) return;

  const { error } = await supabase
    .from("checklist_categories")
    .insert(categories);

  if (error) {
    throw new Error(`체크리스트 카테고리 생성 실패: ${error.message}`);
  }
};

// 체크리스트 아이템 생성 API
export const createChecklistItems = async (
  items: TablesInsert<"checklist_items">[]
) => {
  if (items.length === 0) return;

  const { error } = await supabase.from("checklist_items").insert(items);

  if (error) {
    throw new Error(`체크리스트 아이템 생성 실패: ${error.message}`);
  }
};

// 여행과 체크리스트를 함께 생성하는 트랜잭션 함수
export const createTripWithChecklist = async (
  tripData: TablesInsert<"trips">,
  categories: TablesInsert<"checklist_categories">[],
  items: TablesInsert<"checklist_items">[]
) => {
  // 1. 여행 생성
  const tripDataWithId = tripData;
  const { data: tripResult, error } = await supabase
    .from("trips")
    .insert(tripDataWithId)
    .select("id, user_id")
    .single();

  if (error) {
    throw new Error(`여행 생성 실패: ${error.message} (코드: ${error.code})`);
  }

  // 2. 카테고리 생성
  if (categories.length > 0) {
    await createChecklistCategories(categories);
  }

  // 3. 아이템 생성
  if (items.length > 0) {
    await createChecklistItems(items);
  }

  return tripResult.id;
};
