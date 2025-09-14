import { VStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { colorCombinations, colors } from "@/shared/constants/colors";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";

import TripCard from "./TripCard";
import { useTripList } from "../hooks/useTripList";
import { useUpcomingTrip } from "../hooks/useUpcomingTrip";
import type { Trip } from "../types";

export default function TripList() {
  const navigate = useNavigate();
  const { currentTrips, futureTrips, pastTrips, isLoading, error, noTripList } =
    useTripList();
  const upcomingTripInfo = useUpcomingTrip(futureTrips);

  const goToTripPage = (trip: Trip) => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId: trip.id },
      search: { tripTitle: trip.title },
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

  if (isLoading) {
    return <LoadingSpinner message="여행 목록을 불러오고 있어요..." centered />;
  }

  if (noTripList) {
    return (
      <VStack gap={4} py={8}>
        <Text
          fontSize="lg"
          color={colorCombinations.defaultCard.text}
          opacity={0.7}
          textAlign="center"
        >
          아직 만든 여행 계획이 없어요
        </Text>
        <Text
          fontSize="sm"
          color={colorCombinations.defaultCard.text}
          opacity={0.5}
          textAlign="center"
        >
          새 여행 계획을 시작해보세요!
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="start" gap={3} w="full">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={colorCombinations.defaultCard.text}
      >
        여행 리스트
      </Text>

      <Box w="full" overflowX="auto">
        <VStack gap={4} pb={2} align="stretch">
          {/* 다가오는 여행 알림 */}
          {upcomingTripInfo && (
            <Box
              w="full"
              p={3}
              bg={colors.primary.subtle}
              borderRadius="xl"
              borderLeft="4px solid"
              borderLeftColor={colors.primary.solid}
              cursor="pointer"
              onClick={() => goToTripPage(upcomingTripInfo.trip)}
            >
              <VStack align="start" gap={2}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={colors.primary.fg}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  🎒 {upcomingTripInfo.trip.title}
                </Text>
                <Text
                  ml="24px"
                  fontSize="md"
                  color={colors.primary.fg}
                  opacity={0.8}
                >
                  {upcomingTripInfo.message}
                </Text>
              </VStack>
            </Box>
          )}

          {/* 여행중인 여행 섹션 */}
          {currentTrips && currentTrips?.length > 0 && (
            <VStack gap={3} align="stretch" w="full" pl={2}>
              {currentTrips.map((trip) => (
                <Box
                  key={trip.id}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s"
                >
                  <TripCard trip={trip} onClick={goToTripPage} />
                </Box>
              ))}
            </VStack>
          )}

          {/* 미래 여행 섹션 */}
          {futureTrips.length > 0 && (
            <VStack gap={3} align="stretch" w="full" pl={2}>
              {futureTrips.map((trip) => (
                <Box
                  key={trip.id}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s"
                >
                  <TripCard trip={trip} onClick={goToTripPage} />
                </Box>
              ))}
            </VStack>
          )}

          {/* 과거 여행 섹션 */}
          {pastTrips.length > 0 && (
            <VStack align="start" gap={4} w="full">
              <Box
                w="full"
                p={3}
                bg="gray.50"
                borderRadius="xl"
                borderLeft="4px solid"
                borderLeftColor="gray.300"
              >
                <VStack align="start" gap={1}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="gray.600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    ✈️ 추억이 된 여행
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    소중한 기억들이 담긴 여행들이에요
                  </Text>
                </VStack>
              </Box>
              <VStack gap={3} align="stretch" w="full" pl={2}>
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
