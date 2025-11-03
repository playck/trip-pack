import type { ReactNode } from "react";
import { ScheduleContext, type ScheduleContextValue } from "./scheduleContext";

interface ScheduleProviderProps {
  children: ReactNode;
  value: ScheduleContextValue;
}

export const ScheduleProvider = ({
  children,
  value,
}: ScheduleProviderProps) => {
  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
