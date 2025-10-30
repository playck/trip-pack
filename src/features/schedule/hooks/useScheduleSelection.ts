import { useState } from "react";

/**
 * 일정 선택 관리 훅
 */
export function useScheduleSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (scheduleId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scheduleId)) {
        newSet.delete(scheduleId);
      } else {
        newSet.add(scheduleId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const hasSelection = selectedIds.size > 0;
  const selectionCount = selectedIds.size;

  return {
    selectedIds,
    handleToggleSelect,
    clearSelection,
    hasSelection,
    selectionCount,
  };
}
