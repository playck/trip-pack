import type { CategoryWithItems } from "../../type";

export interface ChecklistProgress {
  totalItems: number;
  checkedItems: number;
  progressPercentage: number;
}

/*
 * 카테고리 배열로부터 전체 체크리스트 체크율 계산
 */

export const calculateChecklistProgress = (
  categories: CategoryWithItems[]
): ChecklistProgress => {
  if (!categories || categories.length === 0) {
    return {
      totalItems: 0,
      checkedItems: 0,
      progressPercentage: 0,
    };
  }

  const totalItems = categories.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const checkedItems = categories.reduce(
    (checked, category) =>
      checked + category.items.filter((item) => item.is_checked).length,
    0
  );

  const progressPercentage =
    totalItems > 0
      ? Math.round((checkedItems / totalItems) * 100 * 10) / 10
      : 0;

  return {
    totalItems,
    checkedItems,
    progressPercentage,
  };
};
