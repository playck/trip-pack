import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import PageLayout from "@/shared/components/layout/PageLayout";
import PullToRefresh from "@/shared/components/PullToRefresh";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { PAYMENT_LIVE, FREE_TRIP_LIMIT } from "@/shared/constants/app";
import { useSubscription } from "@/features/subscription/services/useSubscription";
import PremiumUpsellSheet from "@/features/subscription/components/PremiumUpsellSheet";

import TripList from "./components/TripList";
import IntroBanner from "./components/IntroBanner";
import EmptyTripState from "./components/EmptyTripState";
import { useTripList } from "./hooks/useTripList";

export default function MainPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { noActiveTripList, hasPastTrips, trips } = useTripList();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();
  const { isPremium, isLoading: isTierLoading } = useSubscription(user?.id, {
    enabled: PAYMENT_LIVE,
  });
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);

  // 한도 도달(무료·한도 이상)이면 결제 유도 시트. 최종 강제는 서버 RPC 게이트이며 이건 UX 힌트다.
  const isAtFreeLimit =
    PAYMENT_LIVE &&
    !isTierLoading &&
    !isPremium &&
    trips.length >= FREE_TRIP_LIMIT;

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tripList"] });
  };

  const handleCreateTrip = () => {
    if (isAtFreeLimit) {
      setIsUpsellOpen(true);
      return;
    }
    navigate({ to: "/packing/create" });
  };

  const closeUpsell = () => setIsUpsellOpen(false);

  if (noActiveTripList) {
    return (
      <PageLayout>
        <EmptyTripState
          username={user?.user_metadata?.username}
          isOnline={isOnline}
          onCreateTrip={handleCreateTrip}
          hasPastTrips={hasPastTrips}
        />
        <PremiumUpsellSheet isOpen={isUpsellOpen} onClose={closeUpsell} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <Box w="full" py={3}>
          <VStack gap={2.5} align="stretch">
            <IntroBanner onCreateTrip={handleCreateTrip} />
            <TripList />
          </VStack>
        </Box>
      </PullToRefresh>
      <PremiumUpsellSheet isOpen={isUpsellOpen} onClose={closeUpsell} />
    </PageLayout>
  );
}
