import { VStack, Text, Spinner, Box } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { colorCombinations } from "@/shared/constants/colors";

import TripCard from "./TripCard";
import { useTripList } from "../hooks/useTripList";
import type { Trip } from "../types";

export default function TripList() {
  const { trips, isLoading, error } = useTripList();
  const navigate = useNavigate();

  const handleTripClick = (trip: Trip) => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId: trip.id },
    });
  };

  if (error) {
    return (
      <Box
        p={4}
        bg="red.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="red.200"
      >
        <Text color="red.600" fontSize="sm">
          {error}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <VStack gap={4} py={8}>
        <Spinner size="lg" color={colorCombinations.defaultCard.text} />
        <Text color={colorCombinations.defaultCard.text} opacity={0.7}>
          여행 목록을 불러오고 있어요...
        </Text>
      </VStack>
    );
  }

  if (trips.length === 0) {
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
    <VStack align="start" gap={4} w="full">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={colorCombinations.defaultCard.text}
      >
        내 여행 계획
      </Text>

      <Box w="full" overflowX="auto">
        <VStack gap={4} pb={2} align="stretch">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={handleTripClick} />
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
