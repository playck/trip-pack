import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { MapPin } from "lucide-react";

import { textColors, borderColors } from "@/shared/constants/colors";
import type { PlaceResult } from "../../hooks";

interface PlaceResultItemProps {
  place: PlaceResult;
  onClick: (place: PlaceResult) => void;
}

export default function PlaceResultItem({
  place,
  onClick,
}: PlaceResultItemProps) {
  return (
    <Box
      p={3}
      borderBottomWidth="1px"
      borderColor={borderColors.subtle}
      cursor="pointer"
      onClick={() => onClick(place)}
    >
      <HStack gap={3} align="start">
        <Box pt={1}>
          <MapPin size={18} />
        </Box>
        <VStack align="stretch" gap={0} flex={1}>
          <Text fontWeight="medium" color={textColors.primary}>
            {place.name}
          </Text>
          {place.address && (
            <Text fontSize="sm" color={textColors.tertiary}>
              {place.address}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}
