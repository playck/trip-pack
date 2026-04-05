import { VStack, Text, Input, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BottomSheet } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import type { TemplateItem } from "@/features/packing/type";

interface TemplateEditItemSheetProps {
  isOpen: boolean;
  item?: TemplateItem;
  addTitle?: string;
  onSave: (name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onClose: () => void;
}

export default function TemplateEditItemSheet({
  isOpen,
  item,
  addTitle = "아이템 추가",
  onSave,
  onClose,
}: TemplateEditItemSheetProps) {
  const [itemName, setItemName] = useState(item?.name || "");
  const [itemNotes, setItemNotes] = useState(item?.notes || "");

  const isEditMode = !!item;

  const handleSave = () => {
    if (!itemName.trim()) {
      toaster.create({
        title: "입력 오류",
        description: "아이템 이름을 입력해주세요.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    onSave(itemName.trim(), itemNotes.trim() || undefined);
  };

  const handleCancel = () => {
    setItemName(item?.name || "");
    setItemNotes(item?.notes || "");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setItemName(item?.name || "");
      setItemNotes(item?.notes || "");
    }
  }, [isOpen, item?.name, item?.notes]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "수정하기" : addTitle}
      primaryButton={{
        onClick: handleSave,
        disabled: !itemName.trim(),
      }}
      secondaryButton={{
        onClick: handleCancel,
      }}
    >
      <VStack gap={4} p={3} w="full" align="stretch">
        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            아이템 이름
          </Text>
          <Input
            value={itemName}
            placeholder="아이템 이름을 입력 해 주세요"
            size="md"
            borderRadius="md"
            onChange={(e) => setItemName(e.target.value)}
          />
        </VStack>

        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            메모
          </Text>
          <Textarea
            value={itemNotes}
            placeholder="아이템에 대한 메모를 입력 해 주세요"
            size="md"
            borderRadius="md"
            rows={3}
            maxLength={200}
            resize="none"
            onChange={(e) => setItemNotes(e.target.value)}
          />
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
