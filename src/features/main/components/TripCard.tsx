import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { Calendar } from "lucide-react";

import type { Trip } from "../types";
import { colorCombinations } from "../../../shared/constants/colors";
import { getDuration, formatTripDateRange } from "../../../shared/utiles/date";

interface TripCardProps {
  trip: Trip;
  onClick?: (trip: Trip) => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  return (
    <Box
      position="relative"
      w="full"
      bg={colorCombinations.defaultCard.background}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={colorCombinations.defaultCard.border}
      p={4}
      aspectRatio="2.5 / 1"
      cursor="pointer"
      overflow="hidden"
      onClick={() => onClick?.(trip)}
    >
      {/* 나중에 배경 이미지가 들어갈 자리 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)"
        borderRadius="xl"
      />

      <VStack
        h="full"
        justify="space-between"
        align="start"
        position="relative"
        zIndex={1}
      >
        <VStack align="start" gap={1} flex={1}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={colorCombinations.defaultCard.text}
            lineClamp={2}
            lineHeight="1.3"
          >
            {trip.title}
          </Text>
          {trip.region_name && (
            <Text
              fontSize="sm"
              color={colorCombinations.defaultCard.text}
              opacity={0.7}
              lineClamp={1}
            >
              {trip.region_name}
            </Text>
          )}
        </VStack>

        <HStack gap={2} align="center">
          <Calendar
            size={14}
            color={colorCombinations.defaultCard.text}
            opacity={0.7}
          />
          <Text
            fontSize="sm"
            color={colorCombinations.defaultCard.text}
            opacity={0.7}
          >
            {formatTripDateRange(trip.start_date, trip.end_date)} ·{" "}
            {getDuration(trip.start_date, trip.end_date)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
