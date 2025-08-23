import { HStack, Input, IconButton } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import { useState } from "react";

import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";

interface EditableItemTextProps {
  itemName: string;
  isChecked: boolean;
  onToggleCheck: () => void;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export default function EditableItemText({
  itemName,
  isChecked,
  onToggleCheck,
  onSave,
  onCancel,
}: EditableItemTextProps) {
  const [editingText, setEditingText] = useState(itemName);

  const handleSave = () => {
    if (editingText.trim() && editingText !== itemName) {
      onSave(editingText.trim());
    } else {
      onCancel();
    }
  };

  const handleCancel = () => {
    setEditingText(itemName);
    onCancel();
  };

  return (
    <HStack flex={1} gap={2}>
      <Checkbox
        isChecked={isChecked}
        size="md"
        colorScheme={colors.primary.palette}
        onChange={onToggleCheck}
      />
      <Input
        value={editingText}
        size="sm"
        flex={1}
        borderRadius="md"
        _focus={{
          borderColor: colors.primary.solid,
          boxShadow: colors.primary.subtle,
        }}
        onChange={(e) => setEditingText(e.target.value)}
      />
      <HStack gap={1}>
        <IconButton
          aria-label="저장"
          size="sm"
          variant="ghost"
          color="green.600"
          onClick={handleSave}
        >
          <Check size={16} />
        </IconButton>
        <IconButton
          aria-label="취소"
          size="sm"
          variant="ghost"
          color="gray.500"
          onClick={handleCancel}
        >
          <X size={16} />
        </IconButton>
      </HStack>
    </HStack>
  );
}
