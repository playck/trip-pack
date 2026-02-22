import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { formatShoppingInfo } from "../../list/utils/formatPrice";
import type { ShoppingItem as ShoppingItemType } from "../../type";

interface ShoppingItemProps {
  item: ShoppingItemType;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onToggleCheck?: (itemId: string, isChecked: boolean) => void;
  onOpenActions?: (item: ShoppingItemType) => void;
}

export default function ShoppingItem({
  item,
  isEditMode = false,
  isSelected = false,
  onSelect,
  onToggleCheck,
  onOpenActions,
}: ShoppingItemProps) {
  const isItemChecked = !!item.is_checked;
  const info = formatShoppingInfo(item.price, item.quantity);

  const handleItemCheck = () => {
    if (!item.id) return;
    onToggleCheck?.(item.id, !item.is_checked);
  };

  const handleCardClick = () => {
    if (isEditMode && item.id && onSelect) {
      onSelect(item.id);
    }
  };

  const handleOpenActions = () => {
    onOpenActions?.(item);
  };

  return (
    <Box
      p={isSelected ? "11px" : 3}
      bg="white"
      borderRadius="md"
      border={isSelected ? "2px solid" : "1px solid"}
      borderColor={isSelected ? `${colors.primary.palette}.500` : "gray.200"}
      shadow="xs"
      cursor={isEditMode ? "pointer" : "default"}
      onClick={isEditMode ? handleCardClick : undefined}
    >
      <VStack gap={1} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack
            gap={1}
            flex={1}
            cursor="pointer"
            onClick={isEditMode ? undefined : handleItemCheck}
          >
            <Checkbox
              isChecked={isItemChecked}
              onChange={isEditMode ? () => {} : handleItemCheck}
              size="md"
              colorScheme={colors.primary.palette}
            />
            <Text fontSize="md" fontWeight="medium">
              {item.name}
            </Text>
          </HStack>

          {info && !isEditMode && (
            <Text fontSize="xs" color="gray.500" flexShrink={0} mr={1}>
              {info}
            </Text>
          )}

          <Box
            as="button"
            aria-label="옵션 더보기"
            w="32px"
            h="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            borderRadius="md"
            cursor={isEditMode ? "default" : "pointer"}
            visibility={isEditMode ? "hidden" : "visible"}
            onClick={isEditMode ? undefined : handleOpenActions}
          >
            <MoreVertical size={16} />
          </Box>
        </HStack>

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
