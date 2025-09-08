import { supabase } from "@/shared/service/supabase/cilent";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CategoryWithItems,
  TripWithProgress,
  UseCreateItemParams,
  UseUpdateItemParams,
} from "../../type";

// 여행의 체크리스트 카테고리와 아이템을 가져오는 API
export const getTripChecklist = async (
  tripId: string
): Promise<CategoryWithItems[]> => {
  // 1. 해당 trip의 카테고리들을 가져온다
  const { data: categories, error: categoriesError } = await supabase
    .from("checklist_categories")
    .select("*")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: true });

  if (categoriesError) {
    throw new Error(
      `체크리스트 카테고리를 불러올 수 없습니다: ${categoriesError.message}`
    );
  }

  if (!categories || categories.length === 0) {
    return [];
  }

  // 2. 각 카테고리의 아이템들을 가져온다
  const categoryIds = categories.map((cat) => cat.id);

  const { data: items, error: itemsError } = await supabase
    .from("checklist_items")
    .select("*")
    .in("category_id", categoryIds)
    .order("display_order", { ascending: true });

  if (itemsError) {
    throw new Error(
      `체크리스트 아이템을 불러올 수 없습니다: ${itemsError.message}`
    );
  }

  // 3. 카테고리별로 아이템들을 그룹핑한다
  const categoriesWithItems: CategoryWithItems[] = categories.map(
    (category) => ({
      ...category,
      items: items?.filter((item) => item.category_id === category.id) || [],
    })
  );

  return categoriesWithItems;
};

// 체크리스트 아이템의 체크 상태를 업데이트하는 API
export const updateItemCheckedStatus = async (
  itemId: string,
  isChecked: boolean
): Promise<void> => {
  const { error } = await supabase
    .from("checklist_items")
    .update({
      is_checked: isChecked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) {
    throw new Error(`체크리스트 아이템 업데이트 실패: ${error.message}`);
  }
};

// 새로운 체크리스트 아이템을 추가하는 API
export const createChecklistItem = async (
  params: UseCreateItemParams
): Promise<{ id: string }> => {
  const { data: lastItem } = await supabase
    .from("checklist_items")
    .select("display_order")
    .eq("category_id", params.categoryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextDisplayOrder = (lastItem?.display_order || 0) + 1;

  const { data, error } = await supabase
    .from("checklist_items")
    .insert({
      category_id: params.categoryId,
      name: params.name,
      notes: params.notes || null,
      is_required: false,
      is_checked: false,
      cabin_policy: "allowed",
      cabin_notes: null,
      display_order: nextDisplayOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`아이템 추가 실패: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("아이템 추가 후 ID를 받을 수 없습니다");
  }

  return { id: data.id };
};

// 체크리스트 아이템을 업데이트하는 API
export const updateChecklistItem = async (
  params: UseUpdateItemParams
): Promise<void> => {
  const { error } = await supabase
    .from("checklist_items")
    .update({
      name: params.name,
      notes: params.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.itemId);

  if (error) {
    throw new Error(`아이템 업데이트 실패: ${error.message}`);
  }
};

// 체크리스트 아이템을 삭제하는 API
export const deleteChecklistItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw new Error(`아이템 삭제 실패: ${error.message}`);
  }
};

// 여행의 체크리스트 진행 상태를 가져오는 API (RPC)
export const getTripsWithProgress = async (): Promise<TripWithProgress[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await (supabase as SupabaseClient).rpc(
    "get_trips_with_check_progress",
    {
      p_user_id: user.id,
    }
  );

  if (error) throw new Error(`여행 목록 조회 실패: ${error.message}`);

  return data || [];
};
