import { supabase } from "@/shared/service/supabase/cilent";
import type {
  ShoppingCategoryWithItems,
  UseCreateShoppingItemParams,
  UseUpdateShoppingItemParams,
  UseCreateShoppingCategoryParams,
} from "../../type";

export const getShoppingChecklist = async (
  tripId: string
): Promise<ShoppingCategoryWithItems[]> => {
  const { data: categories, error: categoriesError } = await supabase
    .from("shopping_categories")
    .select("*")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: true });

  if (categoriesError) {
    throw new Error(
      `쇼핑 카테고리를 불러올 수 없습니다: ${categoriesError.message}`
    );
  }

  if (!categories || categories.length === 0) return [];

  const categoryIds = categories.map((cat) => cat.id);

  const { data: items, error: itemsError } = await supabase
    .from("shopping_items")
    .select("*")
    .in("category_id", categoryIds)
    .order("display_order", { ascending: true });

  if (itemsError) {
    throw new Error(
      `쇼핑 아이템을 불러올 수 없습니다: ${itemsError.message}`
    );
  }

  return categories.map((category) => ({
    ...category,
    items: items?.filter((item) => item.category_id === category.id) ?? [],
  }));
};

export const createShoppingCategory = async (
  params: UseCreateShoppingCategoryParams
): Promise<{ id: string }> => {
  const name = params.categoryName.trim();
  if (!name) throw new Error("카테고리 이름을 입력해주세요.");
  if (name.length > 15)
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");

  const { data: lastCategory } = await supabase
    .from("shopping_categories")
    .select("display_order")
    .eq("trip_id", params.tripId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastCategory?.display_order ?? 0) + 1;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("shopping_categories")
    .insert({
      trip_id: params.tripId,
      name,
      icon_key: params.iconKey,
      display_order: nextOrder,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(`카테고리 추가 실패: ${error.message}`);
  if (!data?.id) throw new Error("카테고리 추가 후 ID를 받을 수 없습니다");

  return { id: data.id };
};

export const updateShoppingCategory = async (params: {
  categoryId: string;
  categoryName: string;
  iconKey: string;
}): Promise<void> => {
  const name = params.categoryName.trim();
  if (!name) throw new Error("카테고리 이름을 입력해주세요.");
  if (name.length > 15)
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");

  const { error } = await supabase
    .from("shopping_categories")
    .update({ name, icon_key: params.iconKey })
    .eq("id", params.categoryId);

  if (error) throw new Error(`카테고리 수정 실패: ${error.message}`);
};

export const deleteShoppingCategory = async (
  categoryId: string
): Promise<void> => {
  const { error: itemsError } = await supabase
    .from("shopping_items")
    .delete()
    .eq("category_id", categoryId);

  if (itemsError)
    throw new Error(`카테고리 아이템 삭제 실패: ${itemsError.message}`);

  const { error } = await supabase
    .from("shopping_categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw new Error(`카테고리 삭제 실패: ${error.message}`);
};

export const createShoppingItem = async (
  params: UseCreateShoppingItemParams
): Promise<{ id: string }> => {
  const name = params.name.trim();
  if (!name) throw new Error("아이템 이름을 입력해주세요.");

  const { data: lastItem } = await supabase
    .from("shopping_items")
    .select("display_order")
    .eq("category_id", params.categoryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastItem?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("shopping_items")
    .insert({
      category_id: params.categoryId,
      name,
      notes: params.notes?.trim() || null,
      price: params.price ?? null,
      quantity: params.quantity ?? null,
      is_checked: false,
      display_order: nextOrder,
    })
    .select("id")
    .single();

  if (error) throw new Error(`아이템 추가 실패: ${error.message}`);
  if (!data?.id) throw new Error("아이템 추가 후 ID를 받을 수 없습니다");

  return { id: data.id };
};

export const updateShoppingItem = async (
  params: UseUpdateShoppingItemParams
): Promise<void> => {
  const name = params.name.trim();
  if (!name) throw new Error("아이템 이름을 입력해주세요.");

  const { error } = await supabase
    .from("shopping_items")
    .update({
      name,
      notes: params.notes?.trim() || null,
      price: params.price ?? null,
      quantity: params.quantity ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.itemId);

  if (error) throw new Error(`아이템 수정 실패: ${error.message}`);
};

export const updateShoppingItemChecked = async (
  itemId: string,
  isChecked: boolean
): Promise<void> => {
  const { error } = await supabase
    .from("shopping_items")
    .update({
      is_checked: isChecked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) throw new Error(`체크 상태 변경 실패: ${error.message}`);
};

export const deleteShoppingItems = async (
  itemIds: string[]
): Promise<void> => {
  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .in("id", itemIds);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};

export const deleteShoppingItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};
