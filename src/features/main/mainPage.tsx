import { Box, VStack, Text, Button, HStack, Center } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import PageLayout from "@/shared/components/layout/PageLayout";
import PullToRefresh from "@/shared/components/PullToRefresh";
import { colors, colorCombinations } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

import TripList from "./components/TripList";
import IntroBanner from "./components/IntroBanner";
import { useTripList } from "./hooks/useTripList";

export default function MainPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { noTripList } = useTripList();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tripList"] });
  };

  const handleCreateTrip = () => {
    navigate({ to: "/packing/create" });
  };

  if (noTripList) {
    return (
      <PageLayout>
        <Center h="70vh">
          <VStack gap={8}>
            <VStack gap={3}>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={colorCombinations.defaultCard.text}
                textAlign="center"
              >
                {user?.user_metadata?.username || "여행자"}님,
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="semibold"
                color={colorCombinations.defaultCard.text}
                opacity={0.7}
                textAlign="center"
              >
                어디로 떠나시나요?
              </Text>
            </VStack>

            <Button
              colorPalette={colors.primary.palette}
              size="xl"
              px={8}
              py={6}
              onClick={handleCreateTrip}
              disabled={!isOnline}
              opacity={isOnline ? 1 : 0.5}
            >
              <HStack gap={2}>
                <Plus size={24} />
                <Text fontSize="lg">새 여행 계획 시작하기</Text>
              </HStack>
            </Button>
          </VStack>
        </Center>
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
