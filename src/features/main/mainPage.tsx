import { Box, VStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import PageLayout from "@/shared/components/layout/PageLayout";
import PullToRefresh from "@/shared/components/PullToRefresh";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

import TripList from "./components/TripList";
import IntroBanner from "./components/IntroBanner";
import EmptyTripState from "./components/EmptyTripState";
import { useTripList } from "./hooks/useTripList";

export default function MainPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { noActiveTripList, hasPastTrips } = useTripList();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tripList"] });
  };

  const handleCreateTrip = () => {
    navigate({ to: "/packing/create" });
  };

  if (noActiveTripList) {
    return (
      <PageLayout>
        <EmptyTripState
          username={user?.user_metadata?.username}
          isOnline={isOnline}
          onCreateTrip={handleCreateTrip}
          hasPastTrips={hasPastTrips}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <Box w="full" py={3}>
          <VStack gap={2.5} align="stretch">
            <IntroBanner />
            <TripList />
          </VStack>
        </Box>
      </PullToRefresh>
    </PageLayout>
  );
}
