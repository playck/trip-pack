import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import {
  createExpense,
  type CreateExpenseParams,
  type ExpenseRow,
} from "./api";

// getExpensesByTrip 정렬(expense_date asc, created_at asc)을 캐시에서도 유지하는 비교자.
// setQueryData가 캐시를 정확히 재구성하므로 추가 invalidate(서버 재조회)가 불필요해진다.
function compareExpenseRows(a: ExpenseRow, b: ExpenseRow): number {
  if (a.expense_date !== b.expense_date) {
    return a.expense_date < b.expense_date ? -1 : 1;
  }
  const aCreated = a.created_at ?? "";
  const bCreated = b.created_at ?? "";
  if (aCreated !== bCreated) {
    return aCreated < bCreated ? -1 : 1;
  }
  return 0;
}

interface UseCreateExpenseOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateExpense(
  tripId: string,
  options?: UseCreateExpenseOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateExpenseParams) => {
      return createExpense(params);
    },
    onSuccess: (newRow, variables) => {
      queryClient.setQueryData<ExpenseRow[]>(
        ["tripExpenses", tripId],
        (prev) =>
          prev ? [...prev, newRow].sort(compareExpenseRows) : [newRow],
      );

      toaster.create({
        title: "경비가 추가되었습니다",
        description: `"${variables.category}" 경비가 성공적으로 추가되었습니다.`,
        type: "success",
        duration: 3000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "경비 추가 실패",
        description: error.message,
        type: "error",
        duration: 5000,
      });

      options?.onError?.(error);
    },
  });
}
