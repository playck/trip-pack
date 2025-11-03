import { VStack, HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { LuShare2 } from "react-icons/lu";
import { colors, textColors } from "@/shared/constants/colors";
import { formatTripDateRange } from "@/shared/utiles/date";
import type { TripInfo } from "@/shared/service/tripInfo";

interface TripHeaderProps {
  tripInfo: TripInfo;
  onShareClick?: () => void;
}

export default function TripHeader({
  tripInfo,
  onShareClick,
}: TripHeaderProps) {
  const headerTitle =
    tripInfo.title || `${tripInfo.regionName || "여행"} 여행지`;

  return (
    <VStack pt={4} pb={2} gap={3} align="start">
      <HStack gap={2} flexWrap="wrap" justify="space-between" w="full">
        <HStack gap={2} flexWrap="wrap" flex={1}>
          <Text fontSize="xl" fontWeight="bold" color={textColors.primary}>
            {headerTitle}
          </Text>
        </HStack>
        {onShareClick && (
          <IconButton
            aria-label="일정 공유하기"
            size="sm"
            variant="ghost"
            onClick={onShareClick}
            colorPalette={colors.primary.palette}
          >
            <LuShare2 size={18} />
          </IconButton>
        )}
      </HStack>
      <HStack gap={2} flexWrap="wrap">
        <Text fontSize="sm" color={textColors.tertiary}>
          {formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
        </Text>

        {tripInfo.companionTypes && tripInfo.companionTypes.length > 0 && (
          <>
            <Text fontSize="sm" color={textColors.subtle}>
              •
            </Text>
            <HStack gap={1}>
              {tripInfo.companionTypes.map((companion) => (
                <Badge
                  key={companion}
                  size="sm"
                  variant="subtle"
                  colorPalette={colors.secondary.palette}
                >
                  {companion}
                </Badge>
              ))}
            </HStack>
          </>
        )}

        {tripInfo.tripTypes && tripInfo.tripTypes.length > 0 && (
          <>
            <Text fontSize="sm" color={textColors.subtle}>
              •
            </Text>
            <HStack gap={1}>
              {tripInfo.tripTypes.map((type) => (
                <Badge
                  key={type}
                  size="sm"
                  variant="outline"
                  colorPalette={colors.accent.palette}
                >
                  {type}
                </Badge>
              ))}
            </HStack>
          </>
        )}
      </HStack>
    </VStack>
  );
}
