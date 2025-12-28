import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateExpense, type UpdateExpenseParams } from "./api";

interface UseUpdateExpenseOptions {
  tripId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateExpense(options: UseUpdateExpenseOptions) {
  const queryClient = useQueryClient();
  const { tripId, onSuccess, onError } = options;

  return useMutation({
    mutationFn: (params: UpdateExpenseParams) => {
      return updateExpense(params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tripExpenses", tripId],
      });

      toaster.create({
        title: "경비가 수정되었습니다",
        description: `"${variables.category}" 경비가 성공적으로 수정되었습니다.`,
        type: "success",
        duration: 3000,
      });

      onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "경비 수정 실패",
        description: error.message,
        type: "error",
        duration: 5000,
      });

      onError?.(error);
    },
  });
}
