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
}

export async function createExpense(
  params: CreateExpenseParams
): Promise<ExpenseRow> {
  const expenseData: ExpenseInsert = {
    trip_id: params.tripId,
    expense_date: params.expenseDate,
    day_number: params.dayNumber,
    expense_category: params.category,
    amount: params.amount,
    currency: "KRW",
    schedule_id: params.scheduleId || null,
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

export async function getExpensesByTrip(tripId: string): Promise<ExpenseRow[]> {
  const { data, error } = await supabase
    .from("trip_expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
