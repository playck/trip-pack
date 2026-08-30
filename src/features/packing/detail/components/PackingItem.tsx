import { Box, VStack, Text } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

import { useBaggagePolicy } from "../../list/hooks/useBaggagePolicy";
import type { ChecklistItem } from "../../type";

import PackingItemContent from "./PackingItemContent";

interface PackingItemProps {
  item: ChecklistItem;
  countryCode?: string | null;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onToggleCheck?: (itemId: string, isChecked: boolean) => void;
  onOpenActions?: (item: ChecklistItem) => void;
  onOpenGuide?: (item: ChecklistItem) => void;
}

export default function PackingItem({
  item,
  countryCode,
  isEditMode = false,
  isSelected = false,
  onSelect,
  onToggleCheck,
  onOpenActions,
  onOpenGuide,
}: PackingItemProps) {
  const {
    cabinPolicy,
    cabinNotes,
    checkedPolicy,
    checkedNotes,
    countryWarning,
  } = useBaggagePolicy(item, countryCode);

  const isItemChecked = !!item.is_checked;

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
        <PackingItemContent
          itemName={item.name}
          isChecked={isItemChecked}
          cabinPolicy={cabinPolicy}
          cabinNotes={cabinNotes}
          checkedPolicy={checkedPolicy}
          checkedNotes={checkedNotes}
          countryWarning={countryWarning}
          isEditMode={isEditMode}
          onToggleCheck={handleItemCheck}
          onOpenActions={handleOpenActions}
          onOpenGuide={onOpenGuide ? () => onOpenGuide(item) : undefined}
        />

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
