import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { EllipsisVertical } from "lucide-react";
import type { TemplateItem as TemplateItemType } from "@/features/packing/type";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import TemplateItemActionsSheet from "./TemplateItemActionsSheet";
import TemplateEditItemSheet from "./TemplateEditItemSheet";
import TemplateShoppingItemSheet from "./TemplateShoppingItemSheet";

interface TemplateItemProps {
  item: TemplateItemType;
  categoryType?: string;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onUpdate: (itemId: string, name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onDelete: (itemId: string) => void;
}

export default function TemplateItem({
  item,
  categoryType,
  isEditMode = false,
  isSelected = false,
  onSelect,
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

  const handleUpdate = (
    name: string,
    notes?: string,
    extra?: { price?: number; quantity?: number },
  ) => {
    if (item.id) {
      onUpdate(item.id, name, notes, extra);
    }
    onEditClose();
  };

  const isShopping = categoryType === "shopping";

  const handleCheckboxChange = () => {
    if (item.id && onSelect) {
      onSelect(item.id);
    }
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      border={isSelected ? "2px solid" : "1px solid"}
      borderColor={isSelected ? `${colors.primary.palette}.500` : "gray.200"}
      shadow="xs"
      onClick={isEditMode ? handleCheckboxChange : undefined}
      cursor={isEditMode ? "pointer" : "default"}
    >
      <HStack justify="space-between" align="flex-start">
        <Box flex={1}>
          <Text fontWeight="medium" color="gray.800">
            {item.name}
          </Text>
          {isShopping && (item.price || item.quantity) && (
            <Text fontSize="sm" color={colors.primary.fg} mt={1}>
              {item.price ? `${item.price.toLocaleString()}원` : ""}
              {item.price && item.quantity ? " · " : ""}
              {item.quantity ? `${item.quantity}개` : ""}
            </Text>
          )}
          {item.notes && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              {item.notes}
            </Text>
          )}
        </Box>

        {isEditMode ? (
          <Box onClick={(e) => e.stopPropagation()}>
            <Checkbox
              isChecked={isSelected}
              onChange={handleCheckboxChange}
              colorScheme={colors.primary.palette}
            />
          </Box>
        ) : (
          <Box as="button" p={1} color="gray.400" onClick={onActionsOpen}>
            <EllipsisVertical size={18} />
          </Box>
        )}
      </HStack>

      <TemplateItemActionsSheet
        isOpen={isActionsOpen}
        itemName={item.name}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={onActionsClose}
      />

      {isShopping ? (
        <TemplateShoppingItemSheet
          isOpen={isEditOpen}
          item={item}
          onSave={handleUpdate}
          onClose={onEditClose}
        />
      ) : (
        <TemplateEditItemSheet
          isOpen={isEditOpen}
          item={item}
          onSave={handleUpdate}
          onClose={onEditClose}
        />
      )}
    </Box>
  );
}
