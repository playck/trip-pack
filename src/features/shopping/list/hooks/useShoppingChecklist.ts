import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getShoppingChecklist,
  updateShoppingItemChecked,
} from "../services/api";
import type { ShoppingCategoryWithItems } from "../../type";

export const shoppingKeys = {
  checklist: (tripId: string) => ["shoppingChecklist", tripId] as const,
};

export function useShoppingChecklist(tripId: string | undefined) {
  const {
    data: categories,
    error,
    refetch,
  } = useSuspenseQuery({
    queryKey: tripId ? shoppingKeys.checklist(tripId) : [],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getShoppingChecklist(tripId);
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

export function useUpdateShoppingItemChecked(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isChecked,
    }: {
      itemId: string;
      isChecked: boolean;
    }) => updateShoppingItemChecked(itemId, isChecked),
    onMutate: async ({ itemId, isChecked }) => {
      if (!tripId) return;
      const key = shoppingKeys.checklist(tripId);
      const prev = queryClient.getQueryData<ShoppingCategoryWithItems[]>(key);
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
        queryClient.setQueryData(shoppingKeys.checklist(tripId), ctx.prev);
      }
    },
    onSettled: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
      }
    },
  });
}
