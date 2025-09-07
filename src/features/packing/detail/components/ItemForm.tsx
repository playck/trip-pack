import { useState } from "react";
import {
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useCreateItem } from "../../list/hooks/useCreateItem";

interface ItemFormProps {
  tripId?: string;
  categoryId?: string;
  initialData?: { name: string; notes?: string };
  onClose: () => void;
}

export default function ItemForm({
  tripId,
  categoryId,
  initialData,
  onClose,
}: ItemFormProps) {
  const [itemName, setItemName] = useState(initialData?.name || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const createItemMutation = useCreateItem(tripId, {
    onSuccess: () => {
      onClose();
    },
  });
  const { isPending: isLoading } = createItemMutation;

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

    if (!categoryId) {
      toaster.create({
        title: "오류가 발생했습니다",
        description: "카테고리 정보를 찾을 수 없습니다.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    createItemMutation.mutate({
      categoryId,
      name: itemName.trim(),
      notes: notes.trim() || undefined,
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <VStack gap={0} w="full" h="full" maxH="80vh">
      <Box flex={1} overflowY="auto" w="full" px={4} pt={2}>
        <VStack gap={6} w="full">
          {/* 아이템명 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              아이템명
            </Text>
            <Input
              placeholder="아이템 이름을 입력하세요"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              size="lg"
              borderRadius="xl"
            />
          </VStack>

          {/* 메모 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              메모 (선택사항)
            </Text>
            <Textarea
              placeholder="추가 메모를 입력하세요"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              size="lg"
              borderRadius="xl"
              rows={3}
            />
          </VStack>
        </VStack>
      </Box>

      {/* 저장/취소 버튼*/}
      <Box
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        p={4}
        mt={2}
        w="full"
        bg="white"
        borderTop="1px"
        borderColor="gray.100"
      >
        <HStack gap={3} w="full">
          <Button
            flex={1}
            variant="outline"
            size="lg"
            borderRadius="xl"
            onClick={handleCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            flex={1}
            colorPalette={colors.primary.palette}
            variant="solid"
            size="lg"
            borderRadius="xl"
            onClick={handleItemSave}
            loading={isLoading}
            disabled={isLoading}
          >
            저장
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
