import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateScheduleOrder } from "../services/useUpdateScheduleOrder";
import type { Schedule } from "../types";

/**
 * 일정 순서 변경 관리 훅
 */
export function useScheduleReorder(
  tripId: string,
  originalSchedules: Schedule[],
  onReorderStart?: () => void
) {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const updateOrderMutation = useUpdateScheduleOrder(tripId, {
    onSuccess: () => {
      setHasChanges(false);
      navigate({ to: "/schedule/$tripId", params: { tripId } });
    },
  });

  useEffect(() => {
    if (originalSchedules) {
      setSchedules(originalSchedules);
    }
  }, [originalSchedules]);

  const handleReorder = (newOrder: Schedule[]) => {
    setSchedules(newOrder);
    setHasChanges(true);
    onReorderStart?.(); // 드래그 시 선택 초기화 등
  };

  const handleSave = () => {
    const updates = schedules.map((schedule, index) => ({
      id: schedule.id,
      visitOrder: index + 1,
    }));

    updateOrderMutation.mutate({ updates });
  };

  return {
    schedules,
    hasChanges,
    handleReorder,
    handleSave,
    isSaving: updateOrderMutation.isPending,
  };
}
