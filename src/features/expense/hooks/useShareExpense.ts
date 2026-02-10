import { useCallback } from "react";
import { formatAllExpensesToText } from "../utils/exportExpense";
import { toaster } from "@/shared/components/ui/toaster";
import type { DayExpense, TripBasicInfo } from "../types";

interface UseShareExpenseProps {
  tripInfo: TripBasicInfo | null | undefined;
  dayExpenses: DayExpense[];
}

export function useShareExpense({
  tripInfo,
  dayExpenses,
}: UseShareExpenseProps) {
  const handleShareExpense = useCallback(async () => {
    if (!tripInfo) return;

    const text = formatAllExpensesToText(tripInfo, dayExpenses);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tripInfo.title} 경비 내역`,
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toaster.create({
          title: "경비 내역이 복사되었습니다!",
          type: "success",
          duration: 2000,
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      // 공유 실패 시 클립보드 복사 시도
      try {
        await navigator.clipboard.writeText(text);
        toaster.create({
          title: "경비 내역이 복사되었습니다!",
          description: "공유 기능을 사용할 수 없어 복사했습니다.",
          type: "success",
          duration: 2000,
        });
      } catch {
        toaster.create({
          title: "경비 내역 공유 실패",
          type: "error",
          duration: 2000,
        });
      }
    }
  }, [tripInfo, dayExpenses]);

  return { handleShareExpense };
}
