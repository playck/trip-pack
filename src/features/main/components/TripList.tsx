import { VStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { colorCombinations } from "@/shared/constants/colors";
import StaleDataNotice from "@/shared/components/StaleDataNotice";

import TripCard from "./TripCard";
import NoticeCard from "./NoticeCard";
import { useTripList } from "../hooks/useTripList";
import { useUpcomingTrip } from "../hooks/useUpcomingTrip";
import type { Trip } from "../types";

export default function TripList() {
  const navigate = useNavigate();
  const { currentTrips, futureTrips, error, noTripList } = useTripList();
  const upcomingTripInfo = useUpcomingTrip(futureTrips);

  const goToTripPage = (trip: Trip) => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId: trip.id },
    });
  };

  if (noTripList) {
    return null;
  }

  return (
    <VStack align="start" gap={2} w="full">
      {/* 재조회 실패: 캐시된 목록은 그대로 두고 안내만 */}
      {error && (
        <StaleDataNotice message="최신 목록을 불러오지 못했어요. 당겨서 새로고침해 주세요." />
      )}
      <Text
        fontSize="md"
        fontWeight="bold"
        color={colorCombinations.defaultCard.text}
      >
        여행 리스트
      </Text>

      <Box w="full" overflowX="auto">
        <VStack gap={3} pl={0} pb={2} align="stretch">
          {/* 다가오는 여행 알림 */}
          {upcomingTripInfo && (
            <NoticeCard
              icon="🎒"
              variant="primary"
              title={upcomingTripInfo.trip.title}
              subText={upcomingTripInfo.message}
              onClick={() => goToTripPage(upcomingTripInfo.trip)}
            />
          )}

          {/* 여행중인 여행 섹션 */}
          {currentTrips && currentTrips?.length > 0 && (
            <VStack gap={3} align="stretch" w="full">
              {currentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onClick={goToTripPage} />
              ))}
            </VStack>
          )}

          {/* 미래 여행 섹션 */}
          {futureTrips.length > 0 && (
            <VStack gap={3} align="stretch" w="full">
              {futureTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onClick={goToTripPage} />
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
