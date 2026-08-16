import { Box, HStack, VStack, Text, IconButton } from "@chakra-ui/react";
import { MapPin, Heart } from "lucide-react";

import { textColors, borderColors, statusColors } from "@/shared/constants/colors";
import type { PlaceResult } from "../../hooks";

interface PlaceResultItemProps {
  place: PlaceResult;
  onClick: (place: PlaceResult) => void;
  /** 전달 시 우측에 ♡(가고 싶은 곳 담기) 버튼 노출 */
  onToggleWishlist?: (place: PlaceResult) => void;
  isWishlisted?: boolean;
}

export default function PlaceResultItem({
  place,
  onClick,
  onToggleWishlist,
  isWishlisted = false,
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
        {onToggleWishlist && (
          <IconButton
            aria-label={
              isWishlisted ? "가고 싶은 곳에서 제거" : "가고 싶은 곳에 담기"
            }
            variant="ghost"
            size="sm"
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(place);
            }}
          >
            <Heart
              size={18}
              color={isWishlisted ? statusColors.error.hex[500] : undefined}
              fill={isWishlisted ? statusColors.error.hex[500] : "none"}
            />
          </IconButton>
        )}
      </HStack>
    </Box>
  );
}
