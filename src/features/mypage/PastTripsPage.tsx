import { VStack, Box, Text, Center } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useTripList } from "@/features/main/hooks/useTripList";
import TripCard from "@/features/main/components/TripCard";
import type { Trip } from "@/features/main/types";

export default function PastTripsPage() {
  const navigate = useNavigate();
  const { pastTrips } = useTripList();

  const goToTripPage = (trip: Trip) => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId: trip.id },
    });
  };

  return (
    <PageLayout>
      <VStack align="stretch" gap={3} py={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          추억이 된 여행
        </Text>

        {pastTrips.length === 0 ? (
          <Center h="30vh">
            <Text color="gray.500">지난 여행 기록이 없습니다.</Text>
          </Center>
        ) : (
          <VStack gap={3} align="stretch" w="full">
            {pastTrips.map((trip) => (
              <Box key={trip.id} opacity={0.8}>
                <TripCard trip={trip} onClick={goToTripPage} />
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </PageLayout>
  );
}
