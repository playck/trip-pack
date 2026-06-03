import { supabase } from "@/shared/service/supabase/cilent";
import { verifyTripMembership } from "@/features/trip-members/services/api";
import type {
  TodoCategoryWithItems,
  UseCreateTodoItemParams,
  UseUpdateTodoItemParams,
  UseCreateTodoCategoryParams,
} from "../../type";

export const getTodoChecklist = async (
  tripId: string,
): Promise<TodoCategoryWithItems[]> => {
  await verifyTripMembership(tripId);

  const { data: categories, error: categoriesError } = await supabase
    .from("todo_categories")
    .select("*, todo_items(*)")
    .eq("trip_id", tripId)
    .order("display_order", { ascending: true });

  if (categoriesError) {
    throw new Error(
      `할일 카테고리를 불러올 수 없습니다: ${categoriesError.message}`,
    );
  }

  if (!categories || categories.length === 0) return [];

  const allItems = categories.flatMap((cat) => cat.todo_items ?? []);
  const itemIds = allItems.map((item) => item.id);

  const assigneesMap: Record<
    string,
    { member_id: string; username: string | null }[]
  > = {};

  if (itemIds.length > 0) {
    const { data: assignees, error: assigneesError } = await supabase
      .from("todo_item_assignees")
      .select("todo_item_id, member_id, trip_members(id, profiles(username))")
      .in("todo_item_id", itemIds);

    if (assigneesError) {
      console.error("담당자 조회 실패:", assigneesError.message);
    }

    if (assignees) {
      for (const a of assignees) {
        const itemId = a.todo_item_id;
        if (!assigneesMap[itemId]) {
          assigneesMap[itemId] = [];
        }
        const tripMember = a.trip_members as unknown as {
          id: string;
          profiles: { username: string | null } | null;
        } | null;
        assigneesMap[itemId].push({
          member_id: a.member_id,
          username: tripMember?.profiles?.username ?? null,
        });
      }
    }
  }

  return categories.map((category) => {
    const items = (category.todo_items ?? [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        ...item,
        assignees: assigneesMap[item.id] ?? [],
      }));
    return {
      ...category,
      todo_items: undefined,
      items,
    };
  }) as TodoCategoryWithItems[];
};

export const createTodoCategory = async (
  params: UseCreateTodoCategoryParams,
): Promise<{ id: string }> => {
  await verifyTripMembership(params.tripId);

  const name = params.categoryName.trim();
  if (!name) throw new Error("카테고리 이름을 입력해주세요.");
  if (name.length > 15)
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");

  const { data: lastCategory } = await supabase
    .from("todo_categories")
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
    .from("todo_categories")
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

export const updateTodoCategory = async (params: {
  categoryId: string;
  categoryName: string;
  iconKey: string;
}): Promise<void> => {
  const { data: cat } = await supabase
    .from("todo_categories")
    .select("trip_id")
    .eq("id", params.categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  const name = params.categoryName.trim();
  if (!name) throw new Error("카테고리 이름을 입력해주세요.");
  if (name.length > 15)
    throw new Error("카테고리 이름은 15자 이하로 입력해주세요.");

  const { error } = await supabase
    .from("todo_categories")
    .update({ name, icon_key: params.iconKey })
    .eq("id", params.categoryId);

  if (error) throw new Error(`카테고리 수정 실패: ${error.message}`);
};

export const deleteTodoCategory = async (categoryId: string): Promise<void> => {
  const { data: cat } = await supabase
    .from("todo_categories")
    .select("trip_id")
    .eq("id", categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  const { error: itemsError } = await supabase
    .from("todo_items")
    .delete()
    .eq("category_id", categoryId);

  if (itemsError)
    throw new Error(`카테고리 아이템 삭제 실패: ${itemsError.message}`);

  const { error } = await supabase
    .from("todo_categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error(
      `카테고리 삭제 실패 (아이템은 이미 삭제됨, categoryId: ${categoryId}):`,
      error.message,
    );
    throw new Error(`카테고리 삭제 실패: ${error.message}`);
  }
};

export const createTodoItem = async (
  params: UseCreateTodoItemParams,
): Promise<{ id: string }> => {
  const { data: cat } = await supabase
    .from("todo_categories")
    .select("trip_id")
    .eq("id", params.categoryId)
    .single();
  if (!cat) throw new Error("카테고리를 찾을 수 없습니다.");
  await verifyTripMembership(cat.trip_id);

  const name = params.name.trim();
  if (!name) throw new Error("아이템 이름을 입력해주세요.");

  const { data: lastItem } = await supabase
    .from("todo_items")
    .select("display_order")
    .eq("category_id", params.categoryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (lastItem?.display_order ?? 0) + 1;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { data, error } = await supabase
    .from("todo_items")
    .insert({
      category_id: params.categoryId,
      name,
      notes: params.notes?.trim() || null,
      due_date: params.dueDate || null,
      is_checked: false,
      display_order: nextOrder,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(`아이템 추가 실패: ${error.message}`);
  if (!data?.id) throw new Error("아이템 추가 후 ID를 받을 수 없습니다");

  if (params.assigneeIds && params.assigneeIds.length > 0) {
    await syncTodoItemAssignees(data.id, params.assigneeIds);
  }

  return { id: data.id };
};

export const updateTodoItem = async (
  params: UseUpdateTodoItemParams,
): Promise<void> => {
  await verifyMembershipByItemId(params.itemId);

  const name = params.name.trim();
  if (!name) throw new Error("아이템 이름을 입력해주세요.");

  const { error } = await supabase
    .from("todo_items")
    .update({
      name,
      notes: params.notes?.trim() || null,
      due_date: params.dueDate ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.itemId);

  if (error) throw new Error(`아이템 수정 실패: ${error.message}`);

  if (params.assigneeIds) {
    await syncTodoItemAssignees(params.itemId, params.assigneeIds);
  }
};

const syncTodoItemAssignees = async (
  itemId: string,
  memberIds: string[],
): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("todo_item_assignees")
    .delete()
    .eq("todo_item_id", itemId);

  if (deleteError) {
    console.error("기존 담당자 삭제 실패:", deleteError.message);
  }

  if (memberIds.length === 0) return;

  const rows = memberIds.map((memberId) => ({
    todo_item_id: itemId,
    member_id: memberId,
  }));

  const { error: insertError } = await supabase
    .from("todo_item_assignees")
    .insert(rows);

  if (insertError) {
    console.error("담당자 추가 실패:", insertError.message);
  }
};

/** 아이템 ID로 trip_id를 조회하여 멤버십 검증 */
const verifyMembershipByItemId = async (itemId: string): Promise<void> => {
  const { data: item } = await supabase
    .from("todo_items")
    .select("todo_categories(trip_id)")
    .eq("id", itemId)
    .single();

  const tripId = (
    item?.todo_categories as unknown as { trip_id: string } | null
  )?.trip_id;
  if (!tripId) throw new Error("아이템을 찾을 수 없습니다.");

  await verifyTripMembership(tripId);
};

export const updateTodoItemChecked = async (
  itemId: string,
  isChecked: boolean,
): Promise<void> => {
  await verifyMembershipByItemId(itemId);

  const { error } = await supabase
    .from("todo_items")
    .update({
      is_checked: isChecked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) throw new Error(`체크 상태 변경 실패: ${error.message}`);
};

export const deleteTodoItems = async (itemIds: string[]): Promise<void> => {
  if (itemIds.length === 0) return;

  await verifyMembershipByItemId(itemIds[0]);

  const { error } = await supabase
    .from("todo_items")
    .delete()
    .in("id", itemIds);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};

export const deleteTodoItem = async (itemId: string): Promise<void> => {
  await verifyMembershipByItemId(itemId);

  const { error } = await supabase.from("todo_items").delete().eq("id", itemId);

  if (error) throw new Error(`아이템 삭제 실패: ${error.message}`);
};
