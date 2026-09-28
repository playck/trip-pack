import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { cancelTripNotification } from "@/shared/utils/nativeMessage";
import type { TripInfo } from "@/shared/service/trip/tripInfo";

/**
 * 여행 정보가 "없음"(null)이면 — 방장이 삭제했거나 내보내져 볼 수 없는 여행 —
 * 말없이 튕기거나 빈 화면을 두지 않고 이유를 알린 뒤 홈으로 보낸다.
 * 이 기기에 남은 리마인더도 취소하고, 홈 목록을 새로 받아 유령 카드가 남지 않게 한다.
 */
export function useTripGoneRedirect(
  tripId: string | undefined,
  tripInfo: TripInfo | null | undefined,
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tripId || tripInfo !== null) return;

    cancelTripNotification({ tripId });
    queryClient.invalidateQueries({ queryKey: ["tripList"] });
    toaster.create({
      id: "trip-gone",
      title: "여행을 찾을 수 없어요",
      description: "방장이 삭제했거나 더 이상 참여하지 않는 여행이에요.",
      type: "info",
      duration: 4000,
    });
    navigate({ to: "/main" });
  }, [tripId, tripInfo, navigate, queryClient]);
}
