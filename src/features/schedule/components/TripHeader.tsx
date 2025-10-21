import { VStack, HStack, Text, Badge } from "@chakra-ui/react";
import { colors, textColors } from "@/shared/constants/colors";
import { formatTripDateRange } from "@/shared/utiles/date";
import type { TripInfo } from "@/shared/service/tripInfo";

interface TripHeaderProps {
  tripInfo: TripInfo;
}

export default function TripHeader({ tripInfo }: TripHeaderProps) {
  const headerTitle =
    tripInfo.title || `${tripInfo.regionName || "여행"} 여행지`;

  return (
    <VStack
      pb={2}
      gap={3}
      position="sticky"
      align="start"
      top="56px"
      bg="white"
      zIndex={10}
    >
      <HStack gap={2} flexWrap="wrap">
        <Text fontSize="xl" fontWeight="bold" color={textColors.primary}>
          {headerTitle}
        </Text>
        <HStack gap={2} flexWrap="wrap" align="center">
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
      </HStack>
    </VStack>
  );
}
