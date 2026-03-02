import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getTodoChecklist,
  updateTodoItemChecked,
} from "../services/api";
import type { TodoCategoryWithItems } from "../../type";

export const todoKeys = {
  checklist: (tripId: string) => ["todoChecklist", tripId] as const,
};

export function useTodoChecklist(tripId: string | undefined) {
  const {
    data: categories,
    error,
    refetch,
  } = useSuspenseQuery({
    queryKey: tripId ? todoKeys.checklist(tripId) : [],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getTodoChecklist(tripId);
    },
  });

  const totalItems = categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );
  const checkedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.is_checked).length,
    0
  );
  const progressPercentage =
    totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return {
    categories,
    isLoading: false,
    error: error?.message ?? null,
    refetch,
    progress: { totalItems, checkedItems, progressPercentage },
  };
}

export function useUpdateTodoItemChecked(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isChecked,
    }: {
      itemId: string;
      isChecked: boolean;
    }) => updateTodoItemChecked(itemId, isChecked),
    onMutate: async ({ itemId, isChecked }) => {
      if (!tripId) return;
      const key = todoKeys.checklist(tripId);
      const prev = queryClient.getQueryData<TodoCategoryWithItems[]>(key);
      if (prev) {
        queryClient.setQueryData(
          key,
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, is_checked: isChecked } : item
            ),
          }))
        );
      }
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (tripId && ctx?.prev) {
        queryClient.setQueryData(todoKeys.checklist(tripId), ctx.prev);
      }
    },
    onSettled: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
    },
  });
}
