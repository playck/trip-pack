import { useState, useEffect } from "react";
import { VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";

interface EditExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (name: string, amount: number) => void;
  initialName: string;
  initialAmount: number;
}

export default function EditExpenseSheet({
  isOpen,
  onClose,
  onSaveExpense,
  initialName,
  initialAmount,
}: EditExpenseSheetProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setAmount(initialAmount.toLocaleString());
    }
  }, [isOpen, initialName, initialAmount]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const parsedAmount = parseInt(amount.replace(/,/g, ""), 10);

    if (trimmedName && parsedAmount > 0) {
      onSaveExpense(trimmedName, parsedAmount);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = parseInt(value, 10).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount("");
    }
  };

  const isCanSaveExpense =
    name.trim() && amount && parseInt(amount.replace(/,/g, ""), 10) > 0;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="경비 수정">
      <VStack gap={4} w="full" p={4}>
        <VStack gap={2} w="full">
          <Text fontSize="md" fontWeight="medium" alignSelf="start">
            내용
          </Text>
          <Input
            placeholder="예) 조식"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            borderRadius="xl"
            autoFocus
          />
        </VStack>

        <VStack gap={2} w="full">
          <Text fontSize="md" fontWeight="medium" alignSelf="start">
            금액
          </Text>
          <Input
            placeholder="0"
            value={amount}
            onChange={handleAmountChange}
            inputMode="numeric"
            size="lg"
            borderRadius="xl"
          />
        </VStack>

        <HStack gap={2} w="full" h="12" mt={2}>
          <Button
            variant="outline"
            size="lg"
            flex={1}
            fontWeight="medium"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            variant="solid"
            size="lg"
            flex={1}
            colorPalette="teal"
            fontWeight="medium"
            onClick={handleSave}
            disabled={!isCanSaveExpense}
          >
            저장
          </Button>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
