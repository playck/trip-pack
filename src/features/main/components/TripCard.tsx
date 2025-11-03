import { Box, Text, VStack, Flex, Badge, IconButton } from "@chakra-ui/react";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import type { Trip } from "../types";
import { colorCombinations, colors } from "../../../shared/constants/colors";
import { formatTripDateRange } from "../../../shared/utiles/date";

interface TripCardProps {
  trip: Trip;
  onClick?: (trip: Trip) => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const navigate = useNavigate();

  // D-Day 계산 함수
  const getTripStatus = (
    startDate: string,
    endDate: string | null
  ): string | null => {
    const today = dayjs().startOf("day");
    const tripStartDate = dayjs(startDate);
    const tripEndDate = endDate ? dayjs(endDate) : tripStartDate;

    const isTripInProgress =
      !today.isBefore(tripStartDate) && !today.isAfter(tripEndDate);

    if (isTripInProgress) {
      return "여행중";
    }

    const isTripEnded = today.isAfter(tripEndDate);
    if (isTripEnded) {
      return "여행종료";
    }

    const diffDays = tripStartDate.diff(today, "day");
    return `D-${diffDays}`;
  };

  const tripStatus = getTripStatus(trip.start_date, trip.end_date);

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/schedule/$tripId", params: { tripId: trip.id } });
  };

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

      {/* 일정 버튼 */}
      <IconButton
        position="absolute"
        top={3}
        right={3}
        zIndex={2}
        size="sm"
        variant="subtle"
        aria-label="여행 일정"
        onClick={handleScheduleClick}
        bg="whiteAlpha.900"
        _hover={{ bg: "whiteAlpha.800" }}
        color="gray.700"
      >
        <CalendarDays size={16} />
      </IconButton>

      <VStack
        h="full"
        justify="start"
        align="start"
        position="relative"
        zIndex={1}
      >
        {tripStatus && (
          <Badge
            colorPalette={
              tripStatus === "여행중"
                ? "orange"
                : tripStatus === "여행종료"
                  ? "gray"
                  : colors.primary.palette
            }
            variant="solid"
            fontSize="xs"
            px={2}
            py={1}
            alignSelf="flex-start"
            borderRadius="md"
            fontWeight="bold"
          >
            {tripStatus}
          </Badge>
        )}

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
          <VStack align="start" gap={1}>
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
      </VStack>
    </Box>
  );
}
