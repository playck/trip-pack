import { useEffect } from "react";
import { VStack, Input, Button, HStack, Text, Box } from "@chakra-ui/react";
import { ArrowLeftRight } from "lucide-react";
import { ConfirmDialog } from "@/shared/components";
import { useTripCurrency } from "../hooks/useTripCurrency";
import { useAmountInput } from "../hooks/useAmountInput";

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number | null;
  onSave: (budget: number | null) => void;
  tripId: string;
}

export default function SetBudgetModal({
  isOpen,
  onClose,
  currentBudget,
  onSave,
  tripId,
}: SetBudgetModalProps) {
  const { currencySymbol, isForeignCurrency, exchangeRate } =
    useTripCurrency(tripId);

  const {
    amount,
    handleAmountChange,
    isValidAmount,
    currencyType,
    toggleCurrencyType,
    estimatedKrw,
    toKrwAmount,
    reset,
  } = useAmountInput({ exchangeRate });

  useEffect(() => {
    if (isOpen) {
      reset(currentBudget ? currentBudget.toLocaleString() : "");
    }
  }, [isOpen, currentBudget]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (isValidAmount) {
      onSave(toKrwAmount());
    } else {
      onSave(null);
    }
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="총 예산 설정"
      confirmLabel="저장"
      onConfirm={handleSave}
      size="md"
    >
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between" align="center">
          <HStack gap={2} align="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              금액
            </Text>
            {estimatedKrw && (
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                ≈ {estimatedKrw}원
              </Text>
            )}
          </HStack>

          {isForeignCurrency && (
            <Button
              size="xs"
              variant="ghost"
              colorPalette="teal"
              h="24px"
              p={0}
              onClick={toggleCurrencyType}
            >
              <HStack gap={1}>
                <ArrowLeftRight size={12} />
                <Text fontSize="xs">
                  {currencyType === "KRW"
                    ? "현지화로 입력하기"
                    : "원화로 입력하기"}
                </Text>
              </HStack>
            </Button>
          )}
        </HStack>

        <Box position="relative">
          <Input
            placeholder="0"
            autoFocus
            value={amount}
            onChange={handleAmountChange}
            inputMode="numeric"
            size="lg"
            pl={currencyType === "LOCAL" ? "2rem" : "1rem"}
            pr="2.5rem"
          />

          {currencyType === "LOCAL" && (
            <Text
              position="absolute"
              left="1rem"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              fontWeight="medium"
            >
              {currencySymbol}
            </Text>
          )}
          <Text
            position="absolute"
            right="1rem"
            top="50%"
            transform="translateY(-50%)"
            color="gray.500"
            fontWeight="medium"
          >
            {currencyType === "KRW" ? "원" : ""}
          </Text>
        </Box>
      </VStack>
    </ConfirmDialog>
  );
}
