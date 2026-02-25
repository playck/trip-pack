import {
  VStack,
  Input,
  Text,
  Box,
  Textarea,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { Minus, Plus } from "lucide-react";

interface ShoppingItemFormProps {
  name: string;
  notes: string;
  price?: number;
  quantity?: number;
  onNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onPriceChange: (value: number | undefined) => void;
  onQuantityChange: (value: number | undefined) => void;
}

export default function ShoppingItemForm({
  name,
  notes,
  price,
  quantity,
  onNameChange,
  onNotesChange,
  onPriceChange,
  onQuantityChange,
}: ShoppingItemFormProps) {
  return (
    <VStack gap={0} w="full" h="full" maxH="80vh">
      <Box flex={1} overflowY="auto" w="full" px={4}>
        <VStack gap={5} w="full">
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              아이템명
            </Text>
            <Input
              placeholder="구매할 아이템을 입력하세요"
              value={name}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </VStack>

          <HStack gap={3} w="full">
            <VStack gap={2} flex={1.75}>
              <Text fontSize="md" fontWeight="medium" alignSelf="start">
                가격 (원)
              </Text>
              <Input
                placeholder="0"
                type="number"
                min={0}
                value={price ?? ""}
                size="lg"
                borderRadius="xl"
                onChange={(e) => {
                  const val = e.target.value;
                  const num = Number(val);
                  onPriceChange(val ? Math.max(0, num) : undefined);
                }}
              />
            </VStack>
            <VStack gap={2} flex={1}>
              <Text fontSize="md" fontWeight="medium" alignSelf="start">
                수량
              </Text>
              <HStack gap={3} w="full" justify="space-between">
                <IconButton
                  aria-label="수량 감소"
                  size="lg"
                  variant="outline"
                  borderRadius="full"
                  onClick={() => {
                    const current = quantity ?? 1;
                    if (current > 1) onQuantityChange(current - 1);
                  }}
                  disabled={(quantity ?? 1) <= 1}
                >
                  <Minus size={18} />
                </IconButton>
                <Text fontSize="xl" fontWeight="semibold">
                  {quantity ?? 1}
                </Text>
                <IconButton
                  aria-label="수량 증가"
                  size="lg"
                  variant="outline"
                  borderRadius="full"
                  onClick={() => onQuantityChange((quantity ?? 1) + 1)}
                  disabled={(quantity ?? 1) >= 99}
                >
                  <Plus size={18} />
                </IconButton>
              </HStack>
            </VStack>
          </HStack>

          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              메모 (선택)
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
