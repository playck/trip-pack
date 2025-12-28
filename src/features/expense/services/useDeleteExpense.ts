import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteExpense } from "./api";

interface UseDeleteExpenseOptions {
  tripId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteExpense(options: UseDeleteExpenseOptions) {
  const queryClient = useQueryClient();
  const { tripId, onSuccess, onError } = options;

  return useMutation({
    mutationFn: (expenseId: string) => {
      return deleteExpense(expenseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: "경비가 삭제되었습니다",
        description: "경비가 성공적으로 삭제되었습니다.",
        type: "success",
        duration: 3000,
      });

      onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "경비 삭제 실패",
        description: error.message,
        type: "error",
        duration: 5000,
      });

      onError?.(error);
    },
  });
}
