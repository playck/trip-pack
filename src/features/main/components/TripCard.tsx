import { Box, Text, VStack, Flex, Badge, IconButton } from "@chakra-ui/react";
import dayjs from "dayjs";
import { CalendarDays, DollarSign } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getTripBackgroundImage } from "@/shared/utiles/tripImage";
import { colorCombinations, colors } from "@/shared/constants/colors";
import {
  getEntryDeclaration,
  isDeclarationWindowOpen,
} from "@/shared/data/entryDeclarations";
import { formatTripDateRange } from "@/shared/utiles/date";
import { isDeclarationCheckedInCache } from "@/features/packing/list/utils/declarationStatus";
import type { Trip } from "../types";

interface TripCardProps {
  trip: Trip;
  onClick?: (trip: Trip) => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const backgroundImage = getTripBackgroundImage({
    id: trip.id,
    regionName: trip.region_name,
    countryCode: trip.country_code,
    imageUrl: trip.image_url,
  });

  const getTripStatus = (
    startDate: string,
    endDate: string | null,
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

  // 전자 입국신고 작성 창이 열린 기간에만 배지 노출.
  // 추가 쿼리 없이 날짜·국가 + 이미 캐시된 체크리스트만 읽는다 — 캐시가 없으면
  // 체크 여부를 모르니 배지를 보여주는 쪽(과경고)으로 동작한다.
  const declaration = getEntryDeclaration(trip.country_code);
  const today = dayjs().startOf("day");
  const daysUntilTrip = dayjs(trip.start_date).startOf("day").diff(today, "day");
  const daysUntilTripEnd = dayjs(trip.end_date || trip.start_date)
    .startOf("day")
    .diff(today, "day");
  const showDeclarationBadge =
    !!declaration &&
    isDeclarationWindowOpen(declaration, daysUntilTrip, daysUntilTripEnd) &&
    !isDeclarationCheckedInCache(queryClient, trip.id);

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/schedule/$tripId", params: { tripId: trip.id } });
  };

  const handleExpenseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/expense/$tripId", params: { tripId: trip.id } });
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
      {/* 배경 이미지 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${backgroundImage})`}
        bgSize="cover"
        backgroundPosition="center"
        borderRadius="xl"
      />
      {/* 오버레이 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"
        borderRadius="xl"
      />

      {/* 일정 버튼 */}
      {import.meta.env.DEV && (
      <Flex position="absolute" top={3} right={3} zIndex={2} gap={2}>
        <IconButton
          size="sm"
          variant="subtle"
          aria-label="경비 관리"
          onClick={handleExpenseClick}
          bg="whiteAlpha.900"
          color="gray.700"
        >
          <DollarSign size={16} />
        </IconButton>
        <IconButton
          size="sm"
          variant="subtle"
          aria-label="여행 일정"
          onClick={handleScheduleClick}
          bg="whiteAlpha.900"
          color="gray.700"
        >
          <CalendarDays size={16} />
        </IconButton>
      </Flex>
      )}

      <VStack
        h="full"
        justify="start"
        align="start"
        position="relative"
        zIndex={1}
      >
        <Flex gap={1.5} align="center" alignSelf="flex-start">
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
              borderRadius="md"
              fontWeight="bold"
            >
              {tripStatus}
            </Badge>
          )}
          {showDeclarationBadge && declaration && (
            <Badge
              colorPalette="orange"
              variant="solid"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              fontWeight="bold"
            >
              {declaration.shortName} 작성 기간
            </Badge>
          )}
        </Flex>

        <VStack justify="end" align="start" gap="2px" flex={1}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="white"
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
                  color="white"
                  opacity={0.9}
                  lineClamp={1}
                >
                  {trip.region_name}
                </Text>
              )}
              <Text color="white" opacity={0.9}>
                {" "}
                ·{" "}
              </Text>
              <Text as="span" fontSize="sm" color="white" opacity={0.9}>
                {formatTripDateRange(trip.start_date, trip.end_date)}
              </Text>
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
