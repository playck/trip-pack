import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { PAYMENT_LIVE } from "@/shared/constants/app";
import { createTripWithChecklist } from "./api";
import type { PackingCreateState } from "../store/packingCreateAtom";
import TripAdapter from "../data/tripAdapter";

export const TRIP_LIMIT_ERROR_CODE = "P0001";

function isTripLimitError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = (error as { code?: unknown }).code;
  const message = (error as { message?: unknown }).message;
  return (
    code === TRIP_LIMIT_ERROR_CODE &&
    typeof message === "string" &&
    message.includes("TRIP_LIMIT_EXCEEDED")
  );
}

interface UseCreateTripProps {
  packingCreateState: PackingCreateState;
  userId: string;
  onSuccess?: (data: unknown, tripId: string) => void;
  onError?: (error: Error) => void;
  onTripLimitExceeded?: () => void;
}

export const useCreateTrip = ({
  packingCreateState,
  userId,
  onSuccess,
  onError,
  onTripLimitExceeded,
}: UseCreateTripProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const generatedCheckList = packingCreateState.generatedCheckList;

      if (!generatedCheckList || generatedCheckList.length === 0) {
        throw new Error(
          "체크리스트 데이터가 없습니다. 체크리스트를 먼저 생성해주세요.",
        );
      }

      const tripAdapter = new TripAdapter(packingCreateState, userId);
      const tripData = tripAdapter.adaptTripData();
      const { categories, items } = tripAdapter.adaptCheckListData(
        generatedCheckList,
        "placeholder",
      );

      // HINT-ONLY: 클라 trip 카운트로 생성 차단하지 말 것.
      // 한도 판정 단일 진실은 서버(create_trip_with_checklist RPC).
      const tripId = await createTripWithChecklist(tripData, categories, items);

      return { tripId };
    },

    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tripList"] });
      onSuccess?.(data, data.tripId);
    },
    onError: (error) => {
      if (isTripLimitError(error)) {
        toaster.create({
          type: "info",
          title: "무료 플랜은 여행 3개까지 만들 수 있어요",
          description: PAYMENT_LIVE
            ? "프리미엄으로 업그레이드하면 여행을 무제한으로 만들 수 있어요."
            : "프리미엄 결제는 준비 중이에요. 곧 안내드릴게요.",
          duration: 6000,
          ...(PAYMENT_LIVE && {
            action: {
              label: "프리미엄 보기",
              onClick: () => navigate({ to: "/subscribe" }),
            },
          }),
        });
        onTripLimitExceeded?.();
        return;
      }
      onError?.(error as Error);
    },
  });
};
