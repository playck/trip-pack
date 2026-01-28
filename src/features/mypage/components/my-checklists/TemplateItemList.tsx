import { VStack, Box, Text, useDisclosure } from "@chakra-ui/react";
import type { ChecklistItem } from "@/features/packing/type";
import { FloatingAddButton } from "@/shared/components";
import TemplateItem from "./TemplateItem";
import TemplateEditItemSheet from "./TemplateEditItemSheet";

interface TemplateItemListProps {
  items: ChecklistItem[];
  onAddItem: (name: string, notes?: string) => void;
  onUpdateItem: (itemId: string, name: string, notes?: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function TemplateItemList({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: TemplateItemListProps) {
  const { open: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const handleAddItem = (name: string, notes?: string) => {
    onAddItem(name, notes);
    onAddClose();
  };

  return (
    <>
      <VStack gap={3} align="stretch" pb="80px">
        {items.length === 0 ? (
          <Box py={8} textAlign="center">
            <Text color="gray.500" fontSize="sm">
              아이템이 없습니다
            </Text>
          </Box>
        ) : (
          items.map((item, idx) => (
            <TemplateItem
              key={item.id || `${item.name}-${idx}`}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </VStack>

      <FloatingAddButton onClick={onAddOpen} ariaLabel="새 아이템 추가" />

      <TemplateEditItemSheet
        isOpen={isAddOpen}
        onSave={handleAddItem}
        onClose={onAddClose}
      />
    </>
  );
}
