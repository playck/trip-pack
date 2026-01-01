import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useAtomValue } from "jotai";
import { VStack, HStack, Input, Button, Text, Box } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useExchangeRate } from "@/shared/service/trip/useExchangeRate";
import {
  getCurrencyByCountryCode,
  getCurrencySymbol,
} from "@/shared/utiles/currency";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { showLocalCurrencyAtom } from "../store/currencyStore";

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (name: string, amount: number, scheduleId?: string) => void;
  scheduleName?: string;
  scheduleId?: string;
  date?: string;
  tripId: string;
}
type CurrencyType = "KRW" | "LOCAL";

export default function AddExpenseSheet({
  isOpen,
  onClose,
  onSaveExpense,
  scheduleName,
  scheduleId,
  date,
  tripId,
}: AddExpenseSheetProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyType, setCurrencyType] = useState<CurrencyType>("KRW");
  const showLocalCurrency = useAtomValue(showLocalCurrencyAtom);

  const { data: tripInfo } = useTripInfo(tripId);
  const targetCurrency = getCurrencyByCountryCode(tripInfo?.countryCode);
  const currencySymbol = getCurrencySymbol(targetCurrency);
  const isForeignCurrency = targetCurrency.toLowerCase() !== "krw";

  const { rate: exchangeRate } = useExchangeRate(targetCurrency, "krw", {
    enabled: isForeignCurrency,
  });

  useEffect(() => {
    if (isOpen) {
      setName("");
      setAmount("");

      if (isForeignCurrency && showLocalCurrency) {
        setCurrencyType("LOCAL");
      } else {
        setCurrencyType("KRW");
      }
    }
  }, [isOpen, showLocalCurrency, isForeignCurrency]);

  const handleSave = () => {
    const parsedName = name.trim();
    const inputAmount = parseInt(amount.replace(/,/g, ""), 10);

    if (parsedName && inputAmount > 0) {
      let finalAmount = inputAmount;

      // 현지통화 입력 시 원화로 환산
      if (currencyType === "LOCAL" && exchangeRate && exchangeRate > 0) {
        finalAmount = Math.round(inputAmount * exchangeRate);
      }

      onSaveExpense(parsedName, finalAmount, scheduleId);
      setName("");
      setAmount("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setAmount("");
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

  const toggleCurrencyType = () => {
    setCurrencyType((prev) => (prev === "KRW" ? "LOCAL" : "KRW"));
  };

  const isCanSaveExpense =
    name.trim() && amount && parseInt(amount.replace(/,/g, ""), 10) > 0;

  const estimatedKrw =
    currencyType === "LOCAL" && amount && exchangeRate
      ? Math.round(
          parseInt(amount.replace(/,/g, ""), 10) * exchangeRate
        ).toLocaleString()
      : null;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="경비 추가">
      <VStack gap={3} w="full" p={4} pt={0}>
        {/* 일정 정보 표시 */}
        {scheduleName && (
          <Box
            w="full"
            p={2}
            bg={`${colors.primary.palette}.50`}
            borderRadius="lg"
            borderLeft="4px solid"
            borderColor={colors.primary.palette}
          >
            <HStack justify="space-between" align="center">
              <HStack gap={1}>
                <Text fontSize="xs" color="gray.600" whiteSpace="nowrap">
                  연결된 일정 -
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.800"
                  lineClamp={1}
                >
                  {scheduleName}
                </Text>
                <Text as="span">•</Text>
                {date && (
                  <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                    {date}
                  </Text>
                )}
              </HStack>
            </HStack>
          </Box>
        )}

        {/* 내용 입력 */}
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

        {/* 금액 입력 */}
        <VStack gap={2} w="full">
          <HStack w="full" justify="space-between" align="center">
            <HStack gap={2} align="center">
              <Text fontSize="md" fontWeight="medium">
                금액
              </Text>
              {/* 환산 금액 표시 */}
              {estimatedKrw && (
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  ≈ {estimatedKrw}원
                </Text>
              )}
            </HStack>
            {/* 통화 변경 버튼 */}
            {isForeignCurrency && (
              <Button
                size="xs"
                variant="ghost"
                colorPalette="teal"
                h="24px"
                px={2}
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

          <Box w="full" position="relative">
            <Input
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
              size="lg"
              borderRadius="xl"
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

        <HStack gap={2} w="full" h="12">
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
