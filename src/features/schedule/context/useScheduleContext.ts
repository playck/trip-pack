import { useContext } from "react";
import { ScheduleContext, type ScheduleContextValue } from "./scheduleContext";

export const useScheduleContext = (): ScheduleContextValue => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useScheduleContext must be used within ScheduleProvider");
  }
  return context;
};
