import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { EllipsisVertical } from "lucide-react";
import type { ChecklistItem } from "@/features/packing/type";
import TemplateItemActionsSheet from "./TemplateItemActionsSheet";
import TemplateEditItemSheet from "./TemplateEditItemSheet";

interface TemplateItemProps {
  item: ChecklistItem;
  onUpdate: (itemId: string, name: string, notes?: string) => void;
  onDelete: (itemId: string) => void;
}

export default function TemplateItem({
  item,
  onUpdate,
  onDelete,
}: TemplateItemProps) {
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

  const handleEdit = () => {
    onActionsClose();
    onEditOpen();
  };

  const handleDelete = () => {
    if (item.id) {
      onDelete(item.id);
    }
    onActionsClose();
  };

  const handleUpdate = (name: string, notes?: string) => {
    if (item.id) {
      onUpdate(item.id, name, notes);
    }
    onEditClose();
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
      <HStack justify="space-between" align="flex-start">
        <Box flex={1}>
          <Text fontWeight="medium" color="gray.800">
            {item.name}
          </Text>
          {item.notes && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              {item.notes}
            </Text>
          )}
        </Box>
        <Box
          as="button"
          p={1}
          color="gray.400"
          onClick={onActionsOpen}
        >
          <EllipsisVertical size={18} />
        </Box>
      </HStack>

      <TemplateItemActionsSheet
        isOpen={isActionsOpen}
        itemName={item.name}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={onActionsClose}
      />

      <TemplateEditItemSheet
        isOpen={isEditOpen}
        item={item}
        onSave={handleUpdate}
        onClose={onEditClose}
      />
    </Box>
  );
}
