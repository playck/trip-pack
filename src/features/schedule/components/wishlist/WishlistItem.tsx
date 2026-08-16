import { Box, HStack, VStack, Text, IconButton } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";

import { textColors, borderColors } from "@/shared/constants/colors";
import { getPlaceIcon } from "../../memoIcons";
import type { Wishlist } from "../../types";

interface WishlistItemProps {
  wishlist: Wishlist;
  /** 행 본문 탭 — 주 액션(일정에 추가) */
  onClick: (wishlist: Wishlist) => void;
  /** 전달 시 우측에 ⋮(수정·삭제) 버튼 노출 */
  onOpenAction?: (wishlist: Wishlist) => void;
}

export default function WishlistItem({
  wishlist,
  onClick,
  onOpenAction,
}: WishlistItemProps) {
  const Icon = getPlaceIcon(wishlist.category);

  return (
    <Box
      p={3}
      borderBottomWidth="1px"
      borderColor={borderColors.subtle}
      cursor="pointer"
      onClick={() => onClick(wishlist)}
    >
      <HStack gap={3} align="start">
        <Box pt={1}>
          <Icon size={18} />
        </Box>
        <VStack align="stretch" gap={0} flex={1}>
          <Text fontWeight="medium" color={textColors.primary}>
            {wishlist.place_name}
          </Text>
          {wishlist.place_address && (
            <Text fontSize="sm" color={textColors.tertiary}>
              {wishlist.place_address}
            </Text>
          )}
          {wishlist.notes && (
            <Text fontSize="sm" color={textColors.subtle} lineClamp={1}>
              {wishlist.notes}
            </Text>
          )}
        </VStack>
        {onOpenAction && (
          <IconButton
            aria-label="가고 싶은 곳 관리"
            variant="ghost"
            size="xs"
            color="gray.400"
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation();
              onOpenAction(wishlist);
            }}
          >
            <MoreVertical size={16} />
          </IconButton>
        )}
      </HStack>
    </Box>
  );
}
