import { Box, VStack, Text, Button, HStack, Center } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import { colors, colorCombinations } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";

import TripList from "./components/TripList";
import { useTripList } from "./hooks/useTripList";

export default function MainPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { noTripList } = useTripList();

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
      <Box w="full" py={4}>
        <VStack gap={6} align="stretch">
          <Box
            py={5}
            px={4.5}
            bg={colorCombinations.defaultCard.background}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colorCombinations.defaultCard.border}
            position="relative"
            overflow="hidden"
          >
            <VStack gap={4} align="start">
              <Box>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={colorCombinations.defaultCard.text}
                  opacity={0.8}
                >
                  {user?.user_metadata?.username || "여행자"}님, 어디로
                  떠나시나요?
                </Text>
              </Box>

              <Button
                colorPalette={colors.primary.palette}
                size="lg"
                w="full"
                onClick={handleCreateTrip}
              >
                <HStack gap={2}>
                  <Plus size={20} />
                  <Text>새 여행 계획 시작하기</Text>
                </HStack>
              </Button>
            </VStack>
          </Box>

          {/* 여행 목록 */}
          <TripList />
        </VStack>
      </Box>
    </PageLayout>
  );
}
