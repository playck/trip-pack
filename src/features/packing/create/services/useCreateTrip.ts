import { useMutation } from "@tanstack/react-query";
import { createTripWithChecklist } from "./api";
import type { PackingCreateState } from "../store/packingCreateAtom";
import TripAdapter from "../data/tripAdapter";

interface UseCreateTripProps {
  packingCreateState: PackingCreateState;
  userId: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useCreateTrip = ({
  packingCreateState,
  userId,
  onSuccess,
  onError,
}: UseCreateTripProps) => {
  return useMutation({
    mutationFn: () => {
      const tripId = crypto.randomUUID();

      const tripAdapter = new TripAdapter(packingCreateState, userId);
      const tripData = { ...tripAdapter.adaptTripData(), id: tripId };
      const isCheckListEmpty =
        !packingCreateState.generatedCheckList ||
        packingCreateState.generatedCheckList.length === 0;

      if (isCheckListEmpty) {
        throw new Error(
          "체크리스트 데이터가 없습니다. 체크리스트를 먼저 생성해주세요."
        );
      }

      const { categories, items } = tripAdapter.adaptCheckListData(
        packingCreateState.generatedCheckList || [],
        tripId
      );

      return createTripWithChecklist(tripData, categories, items);
    },
    retry: false,
    onSuccess: (data) => {
      console.log("🎉 여행 및 체크리스트 생성 성공:", data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("💥 여행 및 체크리스트 생성 실패:", error);
      onError?.(error);
    },
  });
};
