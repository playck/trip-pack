import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { useSetAtom, useAtomValue } from "jotai";
import { useState } from "react";

import type { PackItem } from "@/shared/data/checkList";

import {
  toggleItemAtom,
  checkedItemsAtom,
  updateItemNameAtom,
  deleteItemAtom,
} from "../../list/store/checklistAtom";

import EditableItemText from "./EditableItemText";
import PackingItemContent from "./PackingItemContent";
import ItemActionsSheet from "./ItemActionsSheet";

interface PackingItemProps {
  item: PackItem;
  categoryName: string;
}

export default function PackingItem({ item, categoryName }: PackingItemProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const checkedItems = useAtomValue(checkedItemsAtom);
  const toggleItem = useSetAtom(toggleItemAtom);
  const updateItemName = useSetAtom(updateItemNameAtom);
  const deleteItem = useSetAtom(deleteItemAtom);

  const [isEditing, setIsEditing] = useState(false);

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

  const handleItemNameEdit = () => {
    setIsEditing(true);
    onClose();
  };

  const handleItemNameSave = (newName: string) => {
    updateItemName({
      categoryName,
      oldItemName: item.name,
      newItemName: newName,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleItemDelete = () => {
    deleteItem({
      categoryName,
      itemName: item.name,
    });
    onClose();
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
        {isEditing ? (
          <EditableItemText
            itemName={item.name}
            isChecked={isItemChecked()}
            onToggleCheck={handleItemCheck}
            onSave={handleItemNameSave}
            onCancel={handleEditCancel}
          />
        ) : (
          <PackingItemContent
            itemName={item.name}
            isChecked={isItemChecked()}
            onToggleCheck={handleItemCheck}
            onOpenActions={onOpen}
          />
        )}

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>

      <ItemActionsSheet
        isOpen={isOpen}
        onClose={onClose}
        itemName={item.name}
        onEdit={handleItemNameEdit}
        onDelete={handleItemDelete}
      />
    </Box>
  );
}
