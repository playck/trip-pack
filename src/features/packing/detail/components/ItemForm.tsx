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
import { colors } from "@/shared/constants/colors";

interface ItemFormProps {
  onSave: (item: { name: string; notes?: string }) => void;
  onCancel: () => void;
  initialData?: { name: string; notes?: string };
}

export default function ItemForm({
  onSave,
  onCancel,
  initialData,
}: ItemFormProps) {
  const [itemName, setItemName] = useState(initialData?.name || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSave = () => {
    if (!itemName.trim()) {
      alert("아이템 이름을 입력해주세요.");
      return;
    }

    onSave({
      name: itemName.trim(),
      notes: notes.trim() || undefined,
    });
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
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            flex={1}
            colorPalette={colors.primary.palette}
            variant="solid"
            size="lg"
            borderRadius="xl"
            onClick={handleSave}
          >
            저장
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
