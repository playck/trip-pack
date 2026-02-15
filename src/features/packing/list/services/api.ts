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
  tripId: string
): Promise<CategoryWithItems[]> => {
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
  // 1. 아이템명 유효성 검사
  const name = params.name.trim();
  if (!name) {
    throw new Error("아이템 이름을 입력해주세요.");
  }

  // 2. 같은 카테고리 내 중복 아이템명 검사
  const { data: existingItems, error: checkError } = await supabase
    .from("checklist_items")
    .select("name")
    .eq("category_id", params.categoryId);

  if (checkError) {
    throw new Error(`아이템 확인 실패: ${checkError.message}`);
  }

  // 중복 아이템명 검사 (대소문자 구분 없음)
  const isDuplicate = existingItems?.some(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (isDuplicate) {
    throw new Error("이미 존재하는 아이템 이름입니다.");
  }

  // 3. display_order 조회
  const { data: lastItem } = await supabase
    .from("checklist_items")
    .select("display_order")
    .eq("category_id", params.categoryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextDisplayOrder = (lastItem?.display_order || 0) + 1;

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
  params: UseUpdateItemParams
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
    (item) => item.name.toLowerCase() === name.toLowerCase()
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
  itemIds: string[]
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
    }
  );

  if (error) throw new Error(`여행 목록 조회 실패: ${error.message}`);

  return data || [];
};

// 새로운 체크리스트 카테고리를 추가하는 API
export const createChecklistCategory = async (
  params: UseCreateCategoryParams
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
  categoryId: string
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

// 체크리스트 템플릿에서 여러 카테고리와 아이템을 한 번에 추가하는 API
export const createCategoriesFromCheckList = async (
  tripId: string,
  categories: CategoryWithItems[]
): Promise<{
  successCount: number;
  totalCount: number;
  failedCategories: string[];
}> => {
  // 1. 여행 존재 여부 및 권한 확인
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("id", tripId)
    .single();

  if (tripError || !trip) {
    throw new Error("존재하지 않거나 접근할 수 없는 여행입니다.");
  }

  // 2. 마지막 카테고리 아이템 조회
  const { data: lastCategory } = await supabase
    .from("checklist_categories")
    .select("display_order")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  let nextDisplayOrder = (lastCategory?.display_order || 0) + 1;

  // 3. 카테고리와 아이템 생성
  let successCount = 0;
  const failedCategories: string[] = [];

  for (const category of categories) {
    try {
      const categoryName = category.name.trim();

      // 카테고리 생성
      const { data: newCategory, error: categoryError } = await supabase
        .from("checklist_categories")
        .insert({
          trip_id: tripId,
          name: categoryName,
          icon_key: category.icon_key || null,
          display_order: nextDisplayOrder,
        })
        .select("id")
        .single();

      if (categoryError || !newCategory?.id) {
        failedCategories.push(categoryName);
        continue;
      }

      // 아이템 생성
      if (category.items && category.items.length > 0) {
        const item = category.items.map((item, index) => ({
          category_id: newCategory.id,
          name: item.name.trim(),
          notes: item.notes?.trim() || null,
          is_required: item.is_required || false,
          is_checked: false,
          cabin_policy: item.cabin_policy || "allowed",
          cabin_notes: item.cabin_notes || null,
          display_order: index + 1,
        }));

        const { error: itemsError } = await supabase
          .from("checklist_items")
          .insert(item);

        if (itemsError) {
          await supabase
            .from("checklist_categories")
            .delete()
            .eq("id", newCategory.id);
          failedCategories.push(categoryName);
          continue;
        }
      }

      successCount++;
      nextDisplayOrder++;
    } catch {
      failedCategories.push(category.name);
    }
  }

  return {
    successCount,
    totalCount: categories.length,
    failedCategories,
  };
};
