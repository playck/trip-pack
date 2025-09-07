import {
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { BottomSheet } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useUpdateItem } from "../../list/hooks/useCreateItem";
import type { ChecklistItem } from "../../type";

interface EditItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: ChecklistItem;
  tripId?: string;
}

export default function EditItemSheet({
  isOpen,
  onClose,
  item,
  tripId,
}: EditItemSheetProps) {
  const [itemName, setItemName] = useState(item.name);
  const [itemNotes, setItemNotes] = useState(item.notes || "");

  const updateItemMutation = useUpdateItem(tripId, {
    onSuccess: () => {
      onClose();
    },
  });

  const handleItemSave = () => {
    if (!itemName.trim()) {
      toaster.create({
        title: "입력 오류",
        description: "아이템 이름을 입력해주세요.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!item.id) {
      toaster.create({
        title: "오류가 발생했습니다",
        description: "아이템 정보를 찾을 수 없습니다.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    updateItemMutation.mutate({
      itemId: item.id,
      name: itemName.trim(),
      notes: itemNotes.trim() || undefined,
    });
  };

  const handleCancel = () => {
    setItemName(item.name);
    setItemNotes(item.notes || "");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setItemName(item.name);
      setItemNotes(item.notes || "");
    }
  }, [isOpen, item.name, item.notes]);

  return (
    <BottomSheet isOpen={isOpen} onClose={handleCancel} title="수정하기">
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
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemName(e.target.value)}
          />
        </VStack>

        {/* 아이템 설명 */}
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
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemNotes(e.target.value)}
          />
        </VStack>

        <HStack gap={3}>
          <Button
            variant="outline"
            size="lg"
            flex={1}
            borderColor="gray.300"
            color="gray.700"
            onClick={handleCancel}
            disabled={updateItemMutation.isPending}
          >
            취소
          </Button>
          <Button
            size="lg"
            flex={1}
            colorPalette={colors.primary.palette}
            disabled={!itemName.trim() || updateItemMutation.isPending}
            loading={updateItemMutation.isPending}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
            }}
            onClick={handleItemSave}
          >
            저장
          </Button>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
