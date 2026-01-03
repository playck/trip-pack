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
  scheduleExpenses: Record<string, number>;
}

export const ScheduleContext = createContext<ScheduleContextValue | null>(null);
