import dayjs from "dayjs";
import {
  EXPENSE_CATEGORIES,
  findCategoryByLabel,
  type ExpenseCategoryDef,
} from "../constants/categories";

interface ExpenseLike {
  expense_category: string;
  amount: number;
  is_personal: boolean;
  expense_date: string;
}

export interface CategoryBucket {
  def: ExpenseCategoryDef;
  amount: number;
  ratio: number;
}

export interface DailyBucket {
  date: string;
  dayNumber: number;
  label: string;
  amount: number;
}

export function aggregateByCategory(
  expenses: ExpenseLike[],
): CategoryBucket[] {
  const communal = expenses.filter((e) => !e.is_personal);
  const total = communal.reduce((sum, e) => sum + e.amount, 0);
  if (total === 0) return [];

  const buckets = new Map<string, number>();
  communal.forEach((e) => {
    const def = findCategoryByLabel(e.expense_category);
    const key = def ? def.id : "etc";
    buckets.set(key, (buckets.get(key) ?? 0) + e.amount);
  });

  return EXPENSE_CATEGORIES.map((def) => {
    const amount = buckets.get(def.id) ?? 0;
    return {
      def,
      amount,
      ratio: amount / total,
    };
  })
    .filter((b) => b.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function aggregateByDay(
  expenses: ExpenseLike[],
  tripStartDate: string,
  tripEndDate: string,
): DailyBucket[] {
  const start = dayjs(tripStartDate);
  const days = dayjs(tripEndDate).diff(start, "day") + 1;
  const communal = expenses.filter((e) => !e.is_personal);

  const sums = new Map<string, number>();
  communal.forEach((e) => {
    const parsed = dayjs(e.expense_date);
    if (!parsed.isValid()) return;
    const key = parsed.format("YYYY-MM-DD");
    sums.set(key, (sums.get(key) ?? 0) + e.amount);
  });

  if (!Number.isFinite(days) || days <= 0) return [];

  return Array.from({ length: days }, (_, i) => {
    const d = start.add(i, "day");
    const date = d.format("YYYY-MM-DD");
    return {
      date,
      dayNumber: i + 1,
      label: d.format("MM.DD"),
      amount: sums.get(date) ?? 0,
    };
  });
}
