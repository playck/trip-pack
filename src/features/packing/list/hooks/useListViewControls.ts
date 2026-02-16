import { useState, useMemo, useCallback } from "react";
import type { CategoryWithItems } from "../../type";

export function useListViewControls(categories: CategoryWithItems[]) {
  const [showUncheckedOnly, setShowUncheckedOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  const allExpanded = useMemo(
    () => categories.every((cat) => expandedCategories[cat.id] !== false),
    [categories, expandedCategories]
  );

  const toggleAllCategories = useCallback(() => {
    const shouldExpandAll = !allExpanded;
    const newState: Record<string, boolean> = {};
    categories.forEach((cat) => {
      newState[cat.id] = shouldExpandAll;
    });
    setExpandedCategories(newState);
  }, [allExpanded, categories]);

  return {
    showUncheckedOnly,
    setShowUncheckedOnly,
    expandedCategories,
    toggleCategory,
    allExpanded,
    toggleAllCategories,
  };
}
