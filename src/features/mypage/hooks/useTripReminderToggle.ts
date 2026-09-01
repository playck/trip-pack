import { useState } from "react";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
// 여행 목록 API 재사용을 위한 크로스 피처 import — 목록 API를 shared/service/trip 으로
// 옮기는 구조 정리 시 함께 해소 (스펙 §5.3 트레이드오프)
import { getTripList } from "@/features/main/hooks/api";
import type { TripListData } from "@/features/main/types";
import { tripReminderEnabledAtom } from "@/shared/store/notificationSettingsStore";
import {
  scheduleTripNotification,
  cancelTripNotification,
} from "@/shared/utils/nativeMessage";
import { toaster } from "@/shared/components/ui/toaster";

/**
 * 여행 리마인더 전역 토글.
 * ON/OFF 시 진행 중·미래 여행을 순회하며 예약을 일괄 재예약/취소한다.
 * 지난 여행은 예약이 남아있지 않아 제외, 진행 중 여행은 출발 당일
 * 오전 9시 이전의 D-day 알림이 대기 중일 수 있어 포함한다.
 */
export function useTripReminderToggle() {
  const [enabled, setEnabled] = useAtom(tripReminderEnabledAtom);
  const [isToggling, setIsToggling] = useState(false);
  const queryClient = useQueryClient();

  const toggle = async (next: boolean) => {
    if (isToggling) return;
    setIsToggling(true);
    // nativeMessage 게이트가 즉시 next 상태를 보도록 순회 전에 선반영
    setEnabled(next);
    try {
      const data = await queryClient.fetchQuery<TripListData>({
        queryKey: ["tripList"],
        queryFn: getTripList,
      });
      const targets = [...(data.currentTrips ?? []), ...data.futureTrips];
      targets.forEach((trip) => {
        if (next) {
          scheduleTripNotification({
            tripId: trip.id,
            tripTitle: trip.title,
            startDate: trip.start_date,
          });
        } else {
          cancelTripNotification({ tripId: trip.id });
        }
      });
    } catch {
      setEnabled(!next);
      toaster.create({
        title: "알림 설정 변경에 실패했어요",
        description: "잠시 후 다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsToggling(false);
    }
  };

  return { enabled, toggle, isToggling };
}
