import { useQuery } from "@tanstack/react-query";
import { getTripsWithProgress } from "../services/api";

export const useCheckListProgress = (tripId: string) => {
  return useQuery({
    queryKey: ["checklistProgress", tripId],
    queryFn: () => getTripsWithProgress(),
  });
};
