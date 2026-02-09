import { useBulkDeleteSchedules } from "../services/useBulkDeleteSchedules";
import { useMoveSchedules } from "../services/useMoveSchedules";

/**
 * 일정 액션(삭제, 이동) 관리 훅
 */
export function useScheduleActions(
  tripId: string,
  tripStartDate: string,
  onSuccess?: () => void
) {
  const deleteMutation = useBulkDeleteSchedules(tripId, {
    onSuccess,
  });

  const moveMutation = useMoveSchedules(tripId, tripStartDate, {
    onSuccess,
  });

  const handleDelete = (scheduleIds: string[]) => {
    deleteMutation.mutate(scheduleIds);
  };

  const handleMove = (scheduleIds: string[], targetDayNumber: number) => {
    moveMutation.mutate({
      scheduleIds,
      targetDayNumber,
    });
  };

  return {
    handleDelete,
    handleMove,
    isDeleting: deleteMutation.isPending,
    isMoving: moveMutation.isPending,
  };
}
