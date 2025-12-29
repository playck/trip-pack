import { isMemo } from "../../utils/scheduleHelpers";
import type { Schedule } from "../../types";
import { SwipeableWrapper, ScheduleItem, MemoItem } from "./";

interface SwipeableScheduleItemProps {
  schedule: Schedule;
  tripId: string;
}

export default function SwipeableScheduleItem({
  schedule,
  tripId,
}: SwipeableScheduleItemProps) {
  const isScheduleMemo = isMemo(schedule);

  return (
    <SwipeableWrapper schedule={schedule} tripId={tripId}>
      {isScheduleMemo ? (
        <MemoItem memo={schedule} />
      ) : (
        <ScheduleItem schedule={schedule} />
      )}
    </SwipeableWrapper>
  );
}
