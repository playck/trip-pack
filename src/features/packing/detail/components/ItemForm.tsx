import { VStack, Input, Text, Box, Textarea } from "@chakra-ui/react";

interface ItemFormProps {
  name: string;
  notes: string;
  onNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export default function ItemForm({
  name,
  notes,
  onNameChange,
  onNotesChange,
}: ItemFormProps) {
  return (
    <VStack gap={0} w="full" h="full" maxH="80vh">
      <Box flex={1} overflowY="auto" w="full" px={4}>
        <VStack gap={6} w="full">
          {/* 아이템명 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              아이템명
            </Text>
            <Input
              placeholder="아이템 이름을 입력하세요"
              value={name}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </VStack>

          {/* 메모 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              메모 (선택사항)
            </Text>
            <Textarea
              rows={3}
              placeholder="추가 메모를 입력하세요"
              value={notes}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}
