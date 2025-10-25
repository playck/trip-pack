import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";
import { SwipeableWrapper, ScheduleItem, MemoItem } from "./schedule-items";

interface SwipeableScheduleItemProps {
  schedule: Schedule;
  tripId: string;
  onScheduleClick?: (schedule: Schedule) => void;
}

export default function SwipeableScheduleItem({
  schedule,
  tripId,
  onScheduleClick,
}: SwipeableScheduleItemProps) {
  const isScheduleMemo = isMemo(schedule);

  const handleClick = () => {
    if (!isScheduleMemo) {
      onScheduleClick?.(schedule);
    }
  };

  return (
    <SwipeableWrapper schedule={schedule} tripId={tripId}>
      {isScheduleMemo ? (
        <MemoItem memo={schedule} />
      ) : (
        <ScheduleItem schedule={schedule} onClick={handleClick} />
      )}
    </SwipeableWrapper>
  );
}
