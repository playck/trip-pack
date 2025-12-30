import { createContext } from "react";
import type { Schedule } from "../types";

export interface ScheduleContextValue {
  onEditMemo: (
    scheduleId: string,
    memoText: string,
    dayNumber: number,
    date: string
  ) => void;
  onScheduleClick?: (schedule: Schedule) => void;
  onOpenActionSheet?: (schedule: Schedule) => void;
}

export const ScheduleContext = createContext<ScheduleContextValue | null>(null);
