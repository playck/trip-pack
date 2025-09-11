import { useMutation } from "@tanstack/react-query";
import {
  createTripWithChecklist,
  createChecklistCategories,
  createChecklistItems,
} from "./api";
import type { PackingCreateState } from "../store/packingCreateAtom";
import TripAdapter from "../data/tripAdapter";

interface UseCreateTripProps {
  packingCreateState: PackingCreateState;
  userId: string;
  onSuccess?: (data: unknown, tripId: string) => void;
  onError?: (error: Error) => void;
}

export const useCreateTrip = ({
  packingCreateState,
  userId,
  onSuccess,
  onError,
}: UseCreateTripProps) => {
  return useMutation({
    mutationFn: async () => {
      const generatedCheckList = packingCreateState.generatedCheckList;

      const isCheckListEmpty =
        !generatedCheckList || generatedCheckList.length === 0;

      if (isCheckListEmpty) {
        throw new Error(
          "체크리스트 데이터가 없습니다. 체크리스트를 먼저 생성해주세요."
        );
      }

      // 여행 및 체크리스트 데이터 변환
      const tripAdapter = new TripAdapter(packingCreateState, userId);
      const tripData = tripAdapter.adaptTripData(); // id 제거

      // 먼저 여행을 생성하고 실제 ID를 받음
      const actualTripId = await createTripWithChecklist(tripData, [], []);

      // 실제 ID로 카테고리와 아이템 생성
      const { categories, items } = tripAdapter.adaptCheckListData(
        generatedCheckList,
        actualTripId
      );

      // 카테고리와 아이템 추가
      if (categories.length > 0 || items.length > 0) {
        await createChecklistCategories(categories);
        await createChecklistItems(items);
      }

      return { result: actualTripId, tripId: actualTripId };
    },

    retry: false,
    onSuccess: (data) => {
      console.log("🎉 여행 및 체크리스트 생성 성공:", data);
      onSuccess?.(data, data.tripId); // 실제 생성된 ID 사용
    },
    onError: (error) => {
      console.error("💥 여행 및 체크리스트 생성 실패:", error);
      onError?.(error);
    },
  });
};
