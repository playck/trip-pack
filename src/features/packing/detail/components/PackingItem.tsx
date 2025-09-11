import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { CabinPolicy } from "@/shared/components/CabinPolicyIcon";

import { useUpdateItemCheckedStatus } from "../../list/hooks/useTripChecklist";
import type { ChecklistItem } from "../../type";

import PackingItemContent from "./PackingItemContent";
import ItemActionsSheet from "./ItemActionsSheet";
import EditItemSheet from "./EditItemSheet";

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
          isChecked={isItemChecked}
          cabinPolicy={item.cabin_policy as CabinPolicy}
          cabinNotes={item.cabin_notes}
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
    </Box>
  );
}
