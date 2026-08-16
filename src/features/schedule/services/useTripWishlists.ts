import { useQuery } from "@tanstack/react-query";
import { getTripWishlists } from "./wishlistApi";

/**
 * 여행의 위시리스트(가고 싶은 곳) 목록 조회
 */
export const useTripWishlists = (tripId: string | undefined) => {
  return useQuery({
    queryKey: ["tripWishlists", tripId],
    queryFn: () => {
      if (!tripId) throw new Error("Trip ID가 필요합니다.");
      return getTripWishlists(tripId);
    },
    enabled: !!tripId,
    meta: { persist: true },
  });
};
