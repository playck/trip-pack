import {
  VStack,
  Text,
  Input,
  Textarea,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

import { BottomSheet } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useUpdateShoppingItem } from "../../list/hooks/useShoppingMutations";
import type { ShoppingItem } from "../../type";

interface ShoppingEditItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingItem;
  tripId?: string;
}

export default function ShoppingEditItemSheet({
  isOpen,
  onClose,
  item,
  tripId,
}: ShoppingEditItemSheetProps) {
  const [itemName, setItemName] = useState(item.name);
  const [itemNotes, setItemNotes] = useState(item.notes || "");
  const [itemPrice, setItemPrice] = useState<number | undefined>(
    item.price != null ? Number(item.price) : undefined
  );
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(
    item.quantity ?? undefined
  );

  const updateItemMutation = useUpdateShoppingItem(tripId, {
    onSuccess: () => onClose(),
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
      price: itemPrice ?? null,
      quantity: itemQuantity ?? null,
    });
  };

  const handleCancel = () => {
    setItemName(item.name);
    setItemNotes(item.notes || "");
    setItemPrice(item.price != null ? Number(item.price) : undefined);
    setItemQuantity(item.quantity ?? undefined);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setItemName(item.name);
      setItemNotes(item.notes || "");
      setItemPrice(item.price != null ? Number(item.price) : undefined);
      setItemQuantity(item.quantity ?? undefined);
    }
  }, [isOpen, item.name, item.notes, item.price, item.quantity]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleCancel}
      title="수정하기"
      primaryButton={{
        onClick: handleItemSave,
        disabled: !itemName.trim() || updateItemMutation.isPending,
        isLoading: updateItemMutation.isPending,
      }}
      secondaryButton={{
        onClick: handleCancel,
        disabled: updateItemMutation.isPending,
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
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemName(e.target.value)}
          />
        </VStack>

        <HStack gap={3}>
          <VStack gap={2} align="stretch" flex={1.75}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              가격 (원)
            </Text>
            <Input
              value={itemPrice ?? ""}
              placeholder="0"
              type="number"
              size="md"
              borderRadius="md"
              _focus={{
                borderColor: colors.primary.solid,
                boxShadow: colors.primary.focusRing,
              }}
              onChange={(e) => {
                const val = e.target.value;
                setItemPrice(val ? Number(val) : undefined);
              }}
            />
          </VStack>
          <VStack gap={2} align="stretch" flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              수량
            </Text>
            <HStack gap={3} w="full" justify="space-between">
              <IconButton
                aria-label="수량 감소"
                variant="outline"
                size="lg"
                borderRadius="full"
                disabled={(itemQuantity ?? 1) <= 1}
                onClick={() => {
                  const current = itemQuantity ?? 1;
                  if (current > 1) setItemQuantity(current - 1);
                }}
              >
                <Minus size={18} />
              </IconButton>
              <Text fontSize="xl" fontWeight="semibold">
                {itemQuantity ?? 1}
              </Text>
              <IconButton
                aria-label="수량 증가"
                size="lg"
                variant="outline"
                borderRadius="full"
                onClick={() => setItemQuantity((itemQuantity ?? 1) + 1)}
                disabled={(itemQuantity ?? 1) >= 99}
              >
                <Plus size={18} />
              </IconButton>
            </HStack>
          </VStack>
        </HStack>

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
      </VStack>
    </BottomSheet>
  );
}
