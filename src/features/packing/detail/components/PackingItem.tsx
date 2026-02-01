import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { colors } from "@/shared/constants/colors";

import { useBaggagePolicy } from "../../list/hooks/useBaggagePolicy";
import { useUpdateItemCheckedStatus } from "../../list/hooks/useTripChecklist";
import type { ChecklistItem } from "../../type";

import PackingItemContent from "./PackingItemContent";
import ItemActionsSheet from "./ItemActionsSheet";
import EditItemSheet from "./EditItemSheet";

interface PackingItemProps {
  item: ChecklistItem;
  countryCode?: string | null;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
}

export default function PackingItem({
  item,
  countryCode,
  isEditMode = false,
  isSelected = false,
  onSelect,
}: PackingItemProps) {
  const {
    open: isActionsOpen,
    onOpen: onActionsOpen,
    onClose: onActionsClose,
  } = useDisclosure();
  const {
    open: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { tripId } = useParams({
    from: "/packing/category/$tripId",
  });
  const updateItemCheckedMutation = useUpdateItemCheckedStatus(tripId);

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

    updateItemCheckedMutation.mutate({
      itemId: item.id,
      isChecked: !item.is_checked,
    });
  };

  const handleItemEdit = () => {
    onActionsClose();
    onEditOpen();
  };

  const handleCardClick = () => {
    if (isEditMode && item.id && onSelect) {
      onSelect(item.id);
    }
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor={isSelected ? `${colors.primary.palette}.500` : "gray.200"}
      shadow="xs"
      onClick={isEditMode ? handleCardClick : undefined}
      cursor={isEditMode ? "pointer" : "default"}
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
          isSelected={isSelected}
          onToggleCheck={handleItemCheck}
          onOpenActions={onActionsOpen}
        />

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>

      {!isEditMode && (
        <>
          <ItemActionsSheet
            isOpen={isActionsOpen}
            itemId={item.id}
            itemName={item.name}
            tripId={tripId}
            onEdit={handleItemEdit}
            onClose={onActionsClose}
          />

          <EditItemSheet
            isOpen={isEditOpen}
            item={item}
            tripId={tripId}
            onClose={onEditClose}
          />
        </>
      )}
    </Box>
  );
}
