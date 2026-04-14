import { Box, VStack, Text, Button, HStack, Center } from "@chakra-ui/react";
import { Plus, MapPin, Plane } from "lucide-react";

import { colors } from "@/shared/constants/colors";

interface EmptyTripStateProps {
  username?: string;
  isOnline: boolean;
  onCreateTrip: () => void;
}

export default function EmptyTripState({
  username,
  isOnline,
  onCreateTrip,
}: EmptyTripStateProps) {
  return (
    <Center h="75vh">
      <VStack gap={10}>
        <Box position="relative">
          <Box
            w="120px"
            h="120px"
            bg={colors.primary.subtle}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Plane
              size={48}
              color="black"
              strokeWidth={1.5}
              style={{ transform: "rotate(-20deg)" }}
            />
          </Box>
          <Box
            position="absolute"
            bottom="-4px"
            right="-4px"
            w="40px"
            h="40px"
            bg="orange.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MapPin size={20} color="#F97316" strokeWidth={2} />
          </Box>
        </Box>

        <Text
          fontSize="2xl"
          fontWeight="800"
          color="gray.800"
          textAlign="center"
          letterSpacing="-0.5px"
        >
          {username || "여행자"}님,
          <br />
          어디로 떠나시나요?
        </Text>

        <Button
          colorPalette={colors.primary.palette}
          size="xl"
          px={10}
          py={6}
          borderRadius="2xl"
          onClick={onCreateTrip}
          disabled={!isOnline}
          opacity={isOnline ? 1 : 0.5}
          boxShadow="0 4px 14px rgba(0, 0, 0, 0.1)"
        >
          <HStack gap={2}>
            <Plus size={22} strokeWidth={3} />
            <Text fontSize="md" fontWeight="bold">
              여행 준비 시작
            </Text>
          </HStack>
        </Button>
      </VStack>
    </Center>
  );
}
