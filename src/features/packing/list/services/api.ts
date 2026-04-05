import { supabase } from "@/shared/service/supabase/cilent";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CategoryWithItems,
  TripWithProgress,
  UseCreateItemParams,
  UseUpdateItemParams,
  UseCreateCategoryParams,
} from "../../type";

// 여행의 체크리스트 카테고리와 아이템을 가져오는 API
export const getTripChecklist = async (
  tripId: string,
): Promise<CategoryWithItems[]> => {
  const { data, error } = await supabase
    .from("checklist_categories")
    .select("*, checklist_items(*)")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`체크리스트를 불러올 수 없습니다: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((category) => ({
    ...category,
    items: (category.checklist_items ?? []).sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    ),
    checklist_items: undefined,
  })) as CategoryWithItems[];
};

// 체크리스트 아이템의 체크 상태를 업데이트하는 API
export const updateItemCheckedStatus = async (
  itemId: string,
  isChecked: boolean,
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
  params: UseCreateItemParams,
): Promise<{ id: string }> => {
  // 1. 아이템명 유효성 검사
  const name = params.name.trim();
  if (!name) {
    throw new Error("아이템 이름을 입력해주세요.");
  }

  // 2. 중복 검사 + display_order 조회 병렬 실행
  const [existingResult, lastItemResult] = await Promise.all([
    supabase
      .from("checklist_items")
      .select("name")
      .eq("category_id", params.categoryId),
    supabase
      .from("checklist_items")
      .select("display_order")
      .eq("category_id", params.categoryId)
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (existingResult.error) {
    throw new Error(`아이템 확인 실패: ${existingResult.error.message}`);
  }

  const isDuplicate = existingResult.data?.some(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );

  if (isDuplicate) {
    throw new Error("이미 존재하는 아이템 이름입니다.");
  }

  const nextDisplayOrder = (lastItemResult.data?.display_order || 0) + 1;

  // 4. 아이템 생성
  const { data, error } = await supabase
    .from("checklist_items")
    .insert({
      category_id: params.categoryId,
      name: name,
      notes: params.notes?.trim() || null,
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
  params: UseUpdateItemParams,
): Promise<void> => {
  // 1. 아이템명 유효성 검사
  const name = params.name.trim();
  if (!name) {
    throw new Error("아이템 이름을 입력해주세요.");
  }

  // 2. 현재 아이템의 카테고리 ID 조회
  const { data: currentItem, error: currentError } = await supabase
    .from("checklist_items")
    .select("category_id")
    .eq("id", params.itemId)
    .single();

  if (currentError || !currentItem || !currentItem.category_id) {
    throw new Error(`아이템 정보를 찾을 수 없습니다: ${currentError?.message}`);
  }

  // 3. 같은 카테고리 내 중복 아이템명 검사
  const { data: existingItems, error: checkError } = await supabase
    .from("checklist_items")
    .select("name")
    .eq("category_id", currentItem.category_id)
    .neq("id", params.itemId);

  if (checkError) {
    throw new Error(`아이템 확인 실패: ${checkError.message}`);
  }

  // 중복 아이템명 검사
  const isDuplicate = existingItems?.some(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );

  if (isDuplicate) {
    throw new Error("이미 존재하는 아이템 이름입니다.");
  }

  // 4. 아이템 업데이트
  const { error } = await supabase
    .from("checklist_items")
    .update({
      name: name,
      notes: params.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.itemId);

  if (error) {
    throw new Error(`아이템 업데이트 실패: ${error.message}`);
  }
};

// 체크리스트 아이템을 일괄 삭제하는 API
export const deleteChecklistItems = async (
  itemIds: string[],
): Promise<void> => {
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .in("id", itemIds);

  if (error) {
    throw new Error(`아이템 일괄 삭제 실패: ${error.message}`);
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
    },
  );

  if (error) throw new Error(`여행 목록 조회 실패: ${error.message}`);

  return data || [];
};

// 새로운 체크리스트 카테고리를 추가하는 API
export const createChecklistCategory = async (
  params: UseCreateCategoryParams,
): Promise<{ id: string }> => {
  // 1. 여행 존재 여부 및 권한 확인
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("id", params.tripId)
    .single();

  if (tripError || !trip) {
    throw new Error("존재하지 않거나 접근할 수 없는 여행입니다.");
  }

  // 2. 카테고리명 유효성 검사
  const name = params.categoryName.trim();
  if (!name) {
    throw new Error("카테고리 이름을 입력해주세요.");
  }

  if (name.length > 15) {
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");
  }

  // 3. 마지막 display_order 조회
  const { data: lastCategory } = await supabase
    .from("checklist_categories")
    .select("display_order")
    .eq("trip_id", params.tripId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextDisplayOrder = (lastCategory?.display_order || 0) + 1;

  // 4. 카테고리 생성
  const { data, error } = await supabase
    .from("checklist_categories")
    .insert({
      trip_id: params.tripId,
      name: name,
      icon_key: params.iconKey,
      display_order: nextDisplayOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`카테고리 추가 실패: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("카테고리 추가 후 ID를 받을 수 없습니다");
  }

  return { id: data.id };
};

// 체크리스트 카테고리를 수정하는 API
export const updateChecklistCategory = async (params: {
  categoryId: string;
  categoryName: string;
  iconKey: string;
}): Promise<void> => {
  const name = params.categoryName.trim();

  if (!name) {
    throw new Error("카테고리 이름을 입력해주세요.");
  }

  if (name.length > 15) {
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");
  }

  const { error } = await supabase
    .from("checklist_categories")
    .update({ name, icon_key: params.iconKey })
    .eq("id", params.categoryId);

  if (error) {
    throw new Error(`카테고리 수정 실패: ${error.message}`);
  }
};

// 체크리스트 카테고리를 삭제하는 API
export const deleteChecklistCategory = async (
  categoryId: string,
): Promise<void> => {
  // 1. 해당 카테고리의 모든 아이템 먼저 삭제
  const { error: itemsError } = await supabase
    .from("checklist_items")
    .delete()
    .eq("category_id", categoryId);

  if (itemsError) {
    throw new Error(`카테고리 아이템 삭제 실패: ${itemsError.message}`);
  }

  // 2. 카테고리 삭제
  const { error: categoryError } = await supabase
    .from("checklist_categories")
    .delete()
    .eq("id", categoryId);

  if (categoryError) {
    throw new Error(`카테고리 삭제 실패: ${categoryError.message}`);
  }
};

type SectionType = "packing" | "shopping" | "todo";
type CategoryWithType = CategoryWithItems & { category_type?: string };

// 준비물 카테고리 + 아이템 생성
const insertPackingCategory = async (
  tripId: string,
  category: CategoryWithType,
  order: number,
): Promise<boolean> => {
  const { data: newCat, error: catError } = await supabase
    .from("checklist_categories")
    .insert({
      trip_id: tripId,
      name: category.name.trim(),
      icon_key: category.icon_key || null,
      display_order: order,
    })
    .select("id")
    .single();

  if (catError || !newCat?.id) return false;
  if (category.items.length === 0) return true;

  const items = category.items.map((item, idx) => ({
    category_id: newCat.id,
    name: item.name.trim(),
    notes: item.notes?.trim() || null,
    is_required: item.is_required || false,
    is_checked: false,
    cabin_policy: item.cabin_policy || "allowed",
    cabin_notes: item.cabin_notes || null,
    display_order: idx + 1,
  }));

  const { error } = await supabase.from("checklist_items").insert(items);
  if (error) {
    await supabase.from("checklist_categories").delete().eq("id", newCat.id);
    return false;
  }
  return true;
};

// 쇼핑 카테고리 + 아이템 생성
const insertShoppingCategory = async (
  tripId: string,
  category: CategoryWithType,
  order: number,
  userId: string | null,
): Promise<boolean> => {
  const { data: newCat, error: catError } = await supabase
    .from("shopping_categories")
    .insert({
      trip_id: tripId,
      name: category.name.trim(),
      icon_key: category.icon_key || null,
      display_order: order,
      created_by: userId,
      is_shared: false,
    })
    .select("id")
    .single();

  if (catError || !newCat?.id) return false;
  if (category.items.length === 0) return true;

  const items = category.items.map((item, idx) => ({
    category_id: newCat.id,
    name: item.name.trim(),
    notes: item.notes?.trim() || null,
    is_checked: false,
    display_order: idx + 1,
  }));

  const { error } = await supabase.from("shopping_items").insert(items);
  if (error) {
    await supabase.from("shopping_categories").delete().eq("id", newCat.id);
    return false;
  }
  return true;
};

// 할일 카테고리 + 아이템 생성
const insertTodoCategory = async (
  tripId: string,
  category: CategoryWithType,
  order: number,
  userId: string | null,
): Promise<boolean> => {
  const { data: newCat, error: catError } = await supabase
    .from("todo_categories")
    .insert({
      trip_id: tripId,
      name: category.name.trim(),
      icon_key: category.icon_key || null,
      display_order: order,
      created_by: userId,
      is_shared: false,
    })
    .select("id")
    .single();

  if (catError || !newCat?.id) return false;
  if (category.items.length === 0) return true;

  const items = category.items.map((item, idx) => ({
    category_id: newCat.id,
    name: item.name.trim(),
    notes: item.notes?.trim() || null,
    is_checked: false,
    display_order: idx + 1,
    created_by: userId,
  }));

  const { error } = await supabase.from("todo_items").insert(items);
  if (error) {
    await supabase.from("todo_categories").delete().eq("id", newCat.id);
    return false;
  }
  return true;
};

const CATEGORY_TABLE_MAP: Record<SectionType, "checklist_categories" | "shopping_categories" | "todo_categories"> = {
  packing: "checklist_categories",
  shopping: "shopping_categories",
  todo: "todo_categories",
};

// 섹션별 카테고리 목록을 순차 생성하고 결과를 반환하는 헬퍼
const processSectionCategories = async (
  tripId: string,
  type: SectionType,
  categories: CategoryWithType[],
  startOrder: number,
  userId: string | null,
): Promise<{ success: number; failed: string[] }> => {
  let order = startOrder;
  let success = 0;
  const failed: string[] = [];

  for (const category of categories) {
    let ok = false;
    try {
      if (type === "shopping") {
        ok = await insertShoppingCategory(tripId, category, order, userId);
      } else if (type === "todo") {
        ok = await insertTodoCategory(tripId, category, order, userId);
      } else {
        ok = await insertPackingCategory(tripId, category, order);
      }
    } catch {
      // insert 실패
    }

    if (ok) {
      success++;
      order++;
    } else {
      failed.push(category.name.trim());
    }
  }

  return { success, failed };
};

// 체크리스트 템플릿에서 여러 카테고리와 아이템을 한 번에 추가하는 API
export const createCategoriesFromCheckList = async (
  tripId: string,
  categories: CategoryWithType[],
): Promise<{
  successCount: number;
  totalCount: number;
  failedCategories: string[];
}> => {
  // 1. 여행 존재 여부 확인 + 유저 조회 병렬 실행
  const [tripResult, userResult] = await Promise.all([
    supabase.from("trips").select("id").eq("id", tripId).single(),
    supabase.auth.getUser(),
  ]);

  if (tripResult.error || !tripResult.data) {
    throw new Error("존재하지 않거나 접근할 수 없는 여행입니다.");
  }

  const userId = userResult.data.user?.id ?? null;

  // 2. 섹션별로 분류
  const grouped: Record<SectionType, CategoryWithType[]> = {
    packing: [],
    shopping: [],
    todo: [],
  };

  for (const cat of categories) {
    const type = (cat.category_type || "packing") as SectionType;
    (grouped[type] ?? grouped.packing).push(cat);
  }

  // 3. 사용되는 섹션만 필터 + display_order 병렬 조회
  const activeTypes = (Object.keys(grouped) as SectionType[]).filter(
    (t) => grouped[t].length > 0,
  );

  const orderResults = await Promise.all(
    activeTypes.map((type) =>
      supabase
        .from(CATEGORY_TABLE_MAP[type])
        .select("display_order")
        .eq("trip_id", tripId)
        .order("display_order", { ascending: false })
        .limit(1)
        .single()
        .then((res) => ({ type, order: (res.data?.display_order || 0) + 1 })),
    ),
  );

  const nextOrders: Record<string, number> = {};
  for (const { type, order } of orderResults) {
    nextOrders[type] = order;
  }

  // 4. 섹션별로 병렬 생성
  const sectionResults = await Promise.all(
    activeTypes.map((type) =>
      processSectionCategories(tripId, type, grouped[type], nextOrders[type], userId),
    ),
  );

  const successCount = sectionResults.reduce((s, r) => s + r.success, 0);
  const failedCategories = sectionResults.flatMap((r) => r.failed);

  return {
    successCount,
    totalCount: categories.length,
    failedCategories,
  };
};
