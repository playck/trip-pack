import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getTripChecklist, updateItemCheckedStatus } from "../services/api";
import { calculateChecklistProgress } from "../utils/progressCalculator";
import type {
  UseTripChecklistReturn,
  UseUpdateItemCheckedStatusParams,
  CategoryWithItems,
} from "../../type";

export const queryKeys = {
  tripChecklist: (tripId: string) => ["tripChecklist", tripId] as const,
  category: (tripId: string, categoryId: string) =>
    ["tripChecklist", tripId, "category", categoryId] as const,
  item: (tripId: string, itemId: string) =>
    ["tripChecklist", tripId, "item", itemId] as const,
};

export function useTripChecklist(
  tripId: string | undefined
): UseTripChecklistReturn {
  const {
    data: categories,
    error,
    refetch,
  } = useSuspenseQuery({
    queryKey: tripId ? queryKeys.tripChecklist(tripId) : [],
    queryFn: () => {
      if (!tripId) {
        throw new Error("Trip ID가 필요합니다.");
      }
      return getTripChecklist(tripId);
    },
    refetchOnWindowFocus: true,
    meta: { persist: true },
  });

  const progress = calculateChecklistProgress(categories);

  return {
    categories,
    isLoading: false, // Suspense 모드에서는 컴포넌트 레벨에서 로딩 상태를 신경 쓸 필요가 없음
    progress,
    error: error?.message || null,
    refetch,
  };
}

export function useUpdateItemCheckedStatus(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isChecked }: UseUpdateItemCheckedStatusParams) => {
      return updateItemCheckedStatus(itemId, isChecked);
    },
    onMutate: async ({ itemId, isChecked }) => {
      if (!tripId) return;

      const queryKey = queryKeys.tripChecklist(tripId);
      const previousData =
        queryClient.getQueryData<CategoryWithItems[]>(queryKey);

      if (previousData) {
        const updatedData = previousData.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, is_checked: isChecked } : item
          ),
        }));

        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (tripId && context?.previousData) {
        queryClient.setQueryData(
          queryKeys.tripChecklist(tripId),
          context.previousData
        );
      }
    },
    // 토글은 옵티미스틱 boolean 값이 곧 서버 값 → onSettled 전체 재조회 불필요.
    // 실패 시 onError 롤백으로 정확성 보장 (체크 1회당 nested 재조회 egress 제거).
  });
}
