import { useCallback } from "react";
import { toaster } from "@/shared/components/ui/toaster";
import { convertSchedulesToText } from "../utils/convertScheduleToText";
import type { Schedule } from "../types";

export function useShareSchedule() {
  const handleScheduleShare = useCallback(
    async (schedules: Schedule[], tripTitle?: string) => {
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
        if (navigator.share) {
          await navigator.share({
            title: tripTitle ? `${tripTitle} 일정` : "여행 일정",
            text,
          });
          return;
        }

        await navigator.clipboard.writeText(text);
        toaster.create({
          title: "일정이 복사되었습니다",
          type: "success",
          duration: 2000,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        // 공유 실패 시 클립보드 복사 시도
        try {
          await navigator.clipboard.writeText(text);
          toaster.create({
            title: "일정이 복사되었습니다",
            description: "공유 기능을 사용할 수 없어 복사했습니다.",
            type: "success",
            duration: 2000,
          });
        } catch {
          toaster.create({
            title: "일정 공유 실패",
            type: "error",
            duration: 2000,
          });
        }
      }
    },
    []
  );

  return { handleScheduleShare };
}
