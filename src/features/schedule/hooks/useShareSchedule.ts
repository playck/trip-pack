import { toaster } from "@/shared/components/ui/toaster";
import { convertSchedulesToText } from "../utils/convertScheduleToText";
import type { Schedule } from "../types";

export function useShareSchedule() {
  const handleScheduleShare = async (
    schedules: Schedule[],
    tripTitle?: string
  ) => {
    if (!schedules || schedules.length === 0) {
      toaster.create({
        title: "공유할 일정이 없습니다",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    const text = convertSchedulesToText(schedules, tripTitle);

    try {
      await navigator.clipboard.writeText(text);
      toaster.create({
        title: "일정이 복사되었습니다",
        type: "success",
        duration: 2000,
      });
    } catch {
      toaster.create({
        title: "일정 복사 실패",
        type: "error",
        duration: 2000,
      });
    }
  };

  return { handleScheduleShare };
}
