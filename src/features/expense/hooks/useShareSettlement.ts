import { useCallback } from "react";
import { toaster } from "@/shared/components/ui/toaster";
import { formatSettlementToText } from "../utils/exportSettlement";
import type { TripBasicInfo } from "../types";

interface UseShareSettlementParams {
  tripInfo: TripBasicInfo | null | undefined;
  totalAmount: number;
  memberCount: number;
  myPersonalAmount: number;
  myEstimatedTotal: number;
  exchangeRate?: number;
  currencySymbol?: string;
  showLocalCurrency?: boolean;
}

export function useShareSettlement({
  tripInfo,
  totalAmount,
  memberCount,
  myPersonalAmount,
  myEstimatedTotal,
  exchangeRate,
  currencySymbol,
  showLocalCurrency,
}: UseShareSettlementParams) {
  const handleShareSettlement = useCallback(async () => {
    if (!tripInfo) return;

    const text = formatSettlementToText({
      tripInfo,
      totalAmount,
      memberCount,
      myPersonalAmount,
      myEstimatedTotal,
      exchangeRate,
      currencySymbol,
      showLocalCurrency,
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tripInfo.title} 정산 리포트`,
          text,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      toaster.create({
        title: "정산 리포트가 복사되었습니다!",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(text);
        toaster.create({
          title: "정산 리포트가 복사되었습니다!",
          description: "공유 기능을 사용할 수 없어 복사했습니다.",
          type: "success",
          duration: 2000,
        });
      } catch {
        toaster.create({
          title: "정산 리포트 공유 실패",
          type: "error",
          duration: 2000,
        });
      }
    }
  }, [
    tripInfo,
    totalAmount,
    memberCount,
    myPersonalAmount,
    myEstimatedTotal,
    exchangeRate,
    currencySymbol,
    showLocalCurrency,
  ]);

  return { handleShareSettlement };
}
