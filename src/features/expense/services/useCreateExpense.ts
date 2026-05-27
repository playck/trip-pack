import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createExpense, type CreateExpenseParams } from "./api";
import type { Database } from "@/shared/types/database.type";

type ExpenseRow = Database["public"]["Tables"]["trip_expenses"]["Row"];

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
        (prev) => (prev ? [...prev, newRow] : [newRow]),
      );
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

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
