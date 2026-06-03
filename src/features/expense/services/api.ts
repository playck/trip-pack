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
  memo?: string | null;
  scheduleId?: string;
  isPersonal?: boolean;
}

export interface UpdateExpenseParams {
  expenseId: string;
  category: string;
  amount: number;
  memo?: string | null;
  scheduleId?: string | null;
  isPersonal?: boolean;
}

// 경비 추가
export async function createExpense(
  params: CreateExpenseParams,
): Promise<ExpenseRow> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const expenseData: ExpenseInsert = {
    trip_id: params.tripId,
    expense_date: params.expenseDate,
    day_number: params.dayNumber,
    expense_category: params.category,
    amount: params.amount,
    notes: params.memo ?? null,
    currency: "KRW",
    schedule_id: params.scheduleId || null,
    is_personal: params.isPersonal ?? false,
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

  return data;
}

// 여행별 경비 조회
export async function getExpensesByTrip(
  tripId: string,
): Promise<ExpenseRow[]> {
  const { data, error } = await supabase
    .from("trip_expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// 경비 수정
export async function updateExpense(
  params: UpdateExpenseParams,
): Promise<ExpenseRow> {
  const { expenseId, category, amount, scheduleId } = params;

  const updateData: Record<string, unknown> = {
    expense_category: category,
    amount: amount,
  };

  if (params.memo !== undefined) {
    updateData.notes = params.memo;
  }

  if (scheduleId !== undefined) {
    updateData.schedule_id = scheduleId;
  }

  if (params.isPersonal !== undefined) {
    updateData.is_personal = params.isPersonal;
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
