import { VStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { colorCombinations } from "@/shared/constants/colors";
import { ErrorMessage } from "@/shared/components";

import TripCard from "./TripCard";
import NoticeCard from "./NoticeCard";
import { useTripList } from "../hooks/useTripList";
import { useUpcomingTrip } from "../hooks/useUpcomingTrip";
import type { Trip } from "../types";

export default function TripList() {
  const navigate = useNavigate();
  const { currentTrips, futureTrips, pastTrips, error, noTripList } =
    useTripList();
  const upcomingTripInfo = useUpcomingTrip(futureTrips);

  const goToTripPage = (trip: Trip) => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId: trip.id },
    });
  };

  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="여행 목록 불러오기 실패"
        variant="minimal"
      />
    );
  }

  if (noTripList) {
    return null;
  }

  return (
    <VStack align="start" gap={2} w="full">
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={colorCombinations.defaultCard.text}
      >
        여행 리스트
      </Text>

      <Box w="full" overflowX="auto">
        <VStack gap={4} pl={0} pb={2} align="stretch">
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

          {/* 과거 여행 섹션 */}
          {pastTrips.length > 0 && (
            <VStack align="start" gap={4} w="full">
              <NoticeCard icon="✈️" title="추억이 된 여행" variant="gray" />
              <VStack gap={3} align="stretch" w="full">
                {pastTrips.map((trip) => (
                  <Box key={trip.id} opacity={0.8}>
                    <TripCard trip={trip} onClick={goToTripPage} />
                  </Box>
                ))}
              </VStack>
            </VStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
