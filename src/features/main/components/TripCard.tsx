import { Box, Text, VStack, Flex } from "@chakra-ui/react";

import type { Trip } from "../types";
import { colorCombinations } from "../../../shared/constants/colors";
import { formatTripDateRange } from "../../../shared/utiles/date";

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
        justify="start"
        align="start"
        position="relative"
        zIndex={1}
      >
        <VStack justify="end" align="start" gap={1} flex={1}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={colorCombinations.defaultCard.text}
            lineClamp={2}
            lineHeight="1.3"
          >
            {trip.title}
          </Text>
          <Flex gap={1} align="center">
            {trip.region_name && (
              <Text
                as="span"
                fontSize="sm"
                color={colorCombinations.defaultCard.text}
                opacity={0.7}
                lineClamp={1}
              >
                {trip.region_name}
              </Text>
            )}
            <Text> · </Text>
            <Text
              as="span"
              fontSize="sm"
              color={colorCombinations.defaultCard.text}
              opacity={0.7}
            >
              {formatTripDateRange(trip.start_date, trip.end_date)}
            </Text>
          </Flex>
        </VStack>
      </VStack>
    </Box>
  );
}
