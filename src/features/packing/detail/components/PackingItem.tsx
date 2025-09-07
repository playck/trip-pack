import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";

import PackingItemContent from "./PackingItemContent";
import ItemActionsSheet from "./ItemActionsSheet";
import EditItemSheet from "./EditItemSheet";
import type { ChecklistItem } from "../../type";
import { useUpdateItemCheckedStatus } from "../../list/hooks/useTripChecklist";

interface PackingItemProps {
  item: ChecklistItem;
}

export default function PackingItem({ item }: PackingItemProps) {
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

  const isItemChecked = () => {
    return !!item.is_checked;
  };

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

  const handleItemSave = (updatedItemData: {
    name: string;
    notes?: string;
  }) => {
    // TODO: 실제 API 호출로 아이템 업데이트
    console.log("아이템 업데이트:", updatedItemData);
    onEditClose();
  };

  const handleItemDelete = () => {
    // TODO: 실제 API 호출로 아이템 삭제
    console.log("아이템 삭제:", item.name);
    onActionsClose();
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      shadow="xs"
    >
      <VStack gap={1} align="stretch">
        <PackingItemContent
          itemName={item.name}
          isChecked={isItemChecked()}
          onToggleCheck={handleItemCheck}
          onOpenActions={onActionsOpen}
        />

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>

      <ItemActionsSheet
        isOpen={isActionsOpen}
        itemName={item.name}
        onClose={onActionsClose}
        onEdit={handleItemEdit}
        onDelete={handleItemDelete}
      />

      <EditItemSheet
        isOpen={isEditOpen}
        item={{ name: item.name, notes: item.notes || undefined }}
        onClose={onEditClose}
        onSave={handleItemSave}
      />
    </Box>
  );
}
