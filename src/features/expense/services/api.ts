import { supabase } from "@/shared/service/supabase/cilent";
import type { Database } from "@/shared/types/database.type";

type ExpenseInsert = Database["public"]["Tables"]["trip_expenses"]["Insert"];
type ExpenseRow = Database["public"]["Tables"]["trip_expenses"]["Row"];

export interface CreateExpenseParams {
  tripId: string;
  expenseDate: string;
  dayNumber: number;
  category: string;
  amount: number;
  scheduleId?: string;
  isShared?: boolean;
  paidBy?: string | null;
  splitMemberIds?: string[];
}

export interface UpdateExpenseParams {
  expenseId: string;
  category: string;
  amount: number;
  scheduleId?: string | null;
  isShared?: boolean;
  paidBy?: string | null;
  splitMemberIds?: string[];
}

export interface ExpenseWithSplitMembers extends ExpenseRow {
  splitMemberIds: string[];
}

// 정산 대상자 동기화
const syncExpenseSplitMembers = async (
  expenseId: string,
  memberIds: string[],
): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("expense_split_members")
    .delete()
    .eq("expense_id", expenseId);

  if (deleteError) {
    console.error("기존 정산 대상자 삭제 실패:", deleteError.message);
  }

  if (memberIds.length === 0) return;

  const rows = memberIds.map((memberId) => ({
    expense_id: expenseId,
    member_id: memberId,
  }));

  const { error: insertError } = await supabase
    .from("expense_split_members")
    .insert(rows);

  if (insertError) {
    console.error("정산 대상자 추가 실패:", insertError.message);
  }
};

// 경비 추가
export async function createExpense(
  params: CreateExpenseParams,
): Promise<ExpenseRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const expenseData: ExpenseInsert = {
    trip_id: params.tripId,
    expense_date: params.expenseDate,
    day_number: params.dayNumber,
    expense_category: params.category,
    amount: params.amount,
    currency: "KRW",
    schedule_id: params.scheduleId || null,
    is_shared: params.isShared ?? true,
    paid_by: params.paidBy ?? user?.id ?? null,
    created_by: user?.id ?? null,
  };

  const { data, error } = await supabase
    .from("trip_expenses")
    .insert(expenseData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("경비 추가에 실패했습니다.");
  }

  if (params.splitMemberIds && params.splitMemberIds.length > 0) {
    await syncExpenseSplitMembers(data.id, params.splitMemberIds);
  }

  return data;
}

// 여행별 경비 조회 (정산 대상자 포함)
export async function getExpensesByTrip(
  tripId: string,
): Promise<ExpenseWithSplitMembers[]> {
  const { data, error } = await supabase
    .from("trip_expenses")
    .select("*, expense_split_members(member_id)")
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) return [];

  return data.map((expense) => ({
    ...expense,
    expense_split_members: undefined,
    splitMemberIds: (expense.expense_split_members ?? []).map(
      (sm) => sm.member_id,
    ),
  })) as ExpenseWithSplitMembers[];
}

// 경비 수정
export async function updateExpense(
  params: UpdateExpenseParams,
): Promise<ExpenseRow> {
  const { expenseId, category, amount, scheduleId, isShared, paidBy } = params;

  const updateData: Record<string, unknown> = {
    expense_category: category,
    amount: amount,
  };

  if (scheduleId !== undefined) {
    updateData.schedule_id = scheduleId;
  }

  if (isShared !== undefined) {
    updateData.is_shared = isShared;
  }

  if (paidBy !== undefined) {
    updateData.paid_by = paidBy;
  }

  const { data, error } = await supabase
    .from("trip_expenses")
    .update(updateData)
    .eq("id", expenseId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("경비 수정에 실패했습니다.");
  }

  if (params.splitMemberIds !== undefined) {
    await syncExpenseSplitMembers(expenseId, params.splitMemberIds);
  }

  return data;
}

// 경비 삭제
export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await supabase
    .from("trip_expenses")
    .delete()
    .eq("id", expenseId);

  if (error) {
    throw new Error(error.message);
  }
}

// 일정 ID로 연결된 경비 삭제
export async function deleteExpensesByScheduleId(
  scheduleId: string,
): Promise<void> {
  const { error } = await supabase
    .from("trip_expenses")
    .delete()
    .eq("schedule_id", scheduleId);

  if (error) {
    throw new Error(error.message);
  }
}

// 여러 일정 ID로 연결된 경비 일괄 삭제
export async function deleteExpensesByScheduleIds(
  scheduleIds: string[],
): Promise<void> {
  if (scheduleIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("trip_expenses")
    .delete()
    .in("schedule_id", scheduleIds);

  if (error) {
    throw new Error(error.message);
  }
}
