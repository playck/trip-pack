import { useState } from "react";
import { VStack, Input, Button, HStack, Text, Box } from "@chakra-ui/react";
import { ArrowLeftRight } from "lucide-react";
import { ConfirmDialog } from "@/shared/components";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { useExchangeRate } from "@/shared/service/trip/useExchangeRate";
import {
  getCurrencyByCountryCode,
  getCurrencySymbol,
} from "@/shared/utiles/currency";

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number | null;
  onSave: (budget: number | null) => void;
  tripId: string;
}

type CurrencyType = "KRW" | "LOCAL";

export default function SetBudgetModal({
  isOpen,
  onClose,
  currentBudget,
  onSave,
  tripId,
}: SetBudgetModalProps) {
  const { data: tripInfo } = useTripInfo(tripId);
  const targetCurrency = getCurrencyByCountryCode(tripInfo?.countryCode);
  const currencySymbol = getCurrencySymbol(targetCurrency);
  const isForeignCurrency = targetCurrency.toLowerCase() !== "krw";

  const [inputAmount, setInputAmount] = useState(
    currentBudget ? currentBudget.toString() : "",
  );
  const [currencyType, setCurrencyType] = useState<CurrencyType>("KRW");


  const { rate: exchangeRate } = useExchangeRate(targetCurrency, "krw", {
    enabled: isForeignCurrency,
  });

  const handleSave = () => {
    const amount = parseInt(inputAmount.replace(/,/g, ""), 10);

    if (!isNaN(amount)) {
      let finalAmount = amount;

      // 현지통화 입력 시 원화로 환산
      if (currencyType === "LOCAL" && exchangeRate && exchangeRate > 0) {
        finalAmount = Math.round(amount * exchangeRate);
      }

      onSave(finalAmount);
    } else {
      onSave(null);
    }
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = parseInt(value, 10).toLocaleString();
      setInputAmount(formatted);
    } else {
      setInputAmount("");
    }
  };

  const toggleCurrencyType = () => {
    setCurrencyType((prev) => (prev === "KRW" ? "LOCAL" : "KRW"));
    setInputAmount("");
  };

  const estimatedKrw =
    currencyType === "LOCAL" && inputAmount && exchangeRate
      ? Math.round(
          parseInt(inputAmount.replace(/,/g, ""), 10) * exchangeRate
        ).toLocaleString()
      : null;

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
            value={inputAmount}
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
