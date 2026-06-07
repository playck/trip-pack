import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTripWithChecklist } from "./api";
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
  const queryClient = useQueryClient();

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

      const tripId = await createTripWithChecklist(tripData, categories, items);

      return { tripId };
    },

    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tripList"] });
      onSuccess?.(data, data.tripId);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
