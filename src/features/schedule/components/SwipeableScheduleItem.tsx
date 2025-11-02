import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";
import { SwipeableWrapper, ScheduleItem, MemoItem } from "./schedule-items";

interface SwipeableScheduleItemProps {
  schedule: Schedule;
  tripId: string;
  onScheduleClick?: (schedule: Schedule) => void;
  onEditMemo?: (
    scheduleId: string,
    memoText: string,
    dayNumber: number,
    date: string
  ) => void;
}

export default function SwipeableScheduleItem({
  schedule,
  tripId,
  onScheduleClick,
  onEditMemo,
}: SwipeableScheduleItemProps) {
  const isScheduleMemo = isMemo(schedule);

  const handleClick = () => {
    if (!isScheduleMemo) {
      onScheduleClick?.(schedule);
    }
  };

  const handleEditMemo = (scheduleId: string, memoText: string) => {
    onEditMemo?.(
      scheduleId,
      memoText,
      schedule.day_number,
      schedule.schedule_date
    );
  };

  return (
    <SwipeableWrapper schedule={schedule} tripId={tripId}>
      {isScheduleMemo ? (
        <MemoItem memo={schedule} onEdit={handleEditMemo} />
      ) : (
        <ScheduleItem schedule={schedule} onClick={handleClick} />
      )}
    </SwipeableWrapper>
  );
}
