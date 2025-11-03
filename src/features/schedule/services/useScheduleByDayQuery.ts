import { useQuery } from "@tanstack/react-query";
import { getScheduleById } from "./api";

export function useScheduleByDayQuery(scheduleId: string) {
  return useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: () => getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
}
