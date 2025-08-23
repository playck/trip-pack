import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { useSetAtom, useAtomValue } from "jotai";

import type { PackItem } from "@/shared/data/checkList";

import {
  toggleItemAtom,
  checkedItemsAtom,
  updateItemAtom,
  deleteItemAtom,
} from "../../list/store/checklistAtom";

import PackingItemContent from "./PackingItemContent";
import ItemActionsSheet from "./ItemActionsSheet";
import EditItemSheet from "./EditItemSheet";

interface PackingItemProps {
  item: PackItem;
  categoryName: string;
}

export default function PackingItem({ item, categoryName }: PackingItemProps) {
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

  const checkedItems = useAtomValue(checkedItemsAtom);
  const toggleItem = useSetAtom(toggleItemAtom);
  const updateItem = useSetAtom(updateItemAtom);
  const deleteItem = useSetAtom(deleteItemAtom);

  const isItemChecked = () => {
    const key = `${categoryName}-${item.name}`;
    return !!checkedItems[key];
  };

  const handleItemCheck = () => {
    toggleItem({
      categoryName,
      itemName: item.name,
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
    updateItem({
      categoryName,
      oldItemName: item.name,
      updatedItem: updatedItemData,
    });
  };

  const handleItemDelete = () => {
    deleteItem({
      categoryName,
      itemName: item.name,
    });
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
        item={item}
        onClose={onEditClose}
        onSave={handleItemSave}
      />
    </Box>
  );
}
