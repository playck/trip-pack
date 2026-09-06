import { supabase } from "@/shared/service/supabase/cilent";
import { verifyTripMembership } from "@/features/trip-members/services/api";
import type {
  ShoppingCategoryWithItems,
  UseCreateShoppingItemParams,
  UseUpdateShoppingItemParams,
  UseCreateShoppingCategoryParams,
} from "../../type";

export const getShoppingChecklist = async (
  tripId: string,
): Promise<ShoppingCategoryWithItems[]> => {
  await verifyTripMembership(tripId);

  const { data, error } = await supabase
    .from("shopping_categories")
    .select("*, shopping_items(*)")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`쇼핑 리스트를 불러올 수 없습니다: ${error.message}`);
  }

  if (!data || data.length === 0) return [];

  return data.map((category) => ({
    ...category,
    items: (category.shopping_items ?? []).sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    ),
    shopping_items: undefined,
  })) as ShoppingCategoryWithItems[];
};

export const createShoppingCategory = async (
  params: UseCreateShoppingCategoryParams,
): Promise<{ id: string }> => {
  await verifyTripMembership(params.tripId);

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
    .maybeSingle();

  const nextOrder = (lastCategory?.display_order ?? 0) + 1;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { data, error } = await supabase
    .from("shopping_categories")
    .insert({
      trip_id: params.tripId,
      name,
      icon_key: params.iconKey,
      display_order: nextOrder,
      created_by: user?.id ?? null,
      is_shared: params.isShared ?? false,
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
  const { data: cat } = await supabase
    .from("shopping_categories")
    .select("trip_id")
    .eq("id", params.categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  const name = params.categoryName.trim();
  if (!name) throw new Error("카테고리 이름을 입력해주세요.");
  if (name.length > 15)
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");

  const { data, error } = await supabase
    .from("shopping_categories")
    .update({ name, icon_key: params.iconKey })
    .eq("id", params.categoryId)
    .select("id");

  if (error) throw new Error(`카테고리 수정 실패: ${error.message}`);
  // 카테고리 수정은 만든 사람만 가능하다. RLS 가 막으면 오류가 아니라 0행이 온다.
  if (!data?.length)
    throw new Error("카테고리를 만든 사람만 수정할 수 있습니다.");
};

export const deleteShoppingCategory = async (
  categoryId: string,
): Promise<void> => {
  const { data: cat } = await supabase
    .from("shopping_categories")
    .select("trip_id")
    .eq("id", categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  // 물품을 먼저 지우지 않는다.
  // shopping_items.category_id 는 ON DELETE CASCADE 라 카테고리만 지우면 물품도 함께 사라진다.
  const { data, error } = await supabase
    .from("shopping_categories")
    .delete()
    .eq("id", categoryId)
    .select("id");

  if (error) throw new Error(`카테고리 삭제 실패: ${error.message}`);
  if (!data?.length)
    throw new Error("카테고리를 만든 사람만 삭제할 수 있습니다.");
};

export const createShoppingItem = async (
  params: UseCreateShoppingItemParams,
): Promise<{ id: string }> => {
  const { data: cat } = await supabase
    .from("shopping_categories")
    .select("trip_id")
    .eq("id", params.categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  const name = params.name.trim();
  if (!name) throw new Error("아이템 이름을 입력해주세요.");

  const { data: lastItem } = await supabase
    .from("shopping_items")
    .select("display_order")
    .eq("category_id", params.categoryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

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
  params: UseUpdateShoppingItemParams,
): Promise<void> => {
  await verifyMembershipByItemId(params.itemId);

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

/** 아이템 ID로 trip_id를 조회하여 멤버십 검증*/
const verifyMembershipByItemId = async (itemId: string): Promise<void> => {
  const { data: item } = await supabase
    .from("shopping_items")
    .select("shopping_categories(trip_id)")
    .eq("id", itemId)
    .single();

  const tripId = (
    item?.shopping_categories as unknown as { trip_id: string } | null
  )?.trip_id;
  if (!tripId) throw new Error("아이템을 찾을 수 없습니다.");

  await verifyTripMembership(tripId);
};

export const updateShoppingItemChecked = async (
  itemId: string,
  isChecked: boolean,
): Promise<void> => {
  await verifyMembershipByItemId(itemId);

  const { error } = await supabase
    .from("shopping_items")
    .update({
      is_checked: isChecked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) throw new Error(`체크 상태 변경 실패: ${error.message}`);
};

export const deleteShoppingItems = async (itemIds: string[]): Promise<void> => {
  if (itemIds.length === 0) return;

  await verifyMembershipByItemId(itemIds[0]);

  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .in("id", itemIds);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};

export const deleteShoppingItem = async (itemId: string): Promise<void> => {
  await verifyMembershipByItemId(itemId);

  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};
