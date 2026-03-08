import { Box, Text, HStack } from "@chakra-ui/react";
import { ArrowLeftRight } from "lucide-react";
import type { CurrencyType } from "../../hooks/useAmountInput";

interface CalculatorDisplayProps {
  displayValue: string;
  expression: string;
  hasExpression: boolean;
  currencySymbol?: string;
  currencyType?: CurrencyType;
  estimatedKrw?: string | null;
  isForeignCurrency?: boolean;
  onToggleCurrency?: () => void;
}

export default function CalculatorDisplay({
  displayValue,
  expression,
  hasExpression,
  currencySymbol,
  currencyType = "KRW",
  estimatedKrw,
  isForeignCurrency = false,
  onToggleCurrency,
}: CalculatorDisplayProps) {
  const prefix =
    currencyType === "LOCAL" && currencySymbol ? currencySymbol : "₩";
  const isEvaluated = !hasExpression && expression !== "";
  const mainText = hasExpression
    ? `${prefix} ${expression}`
    : `${prefix} ${displayValue}`;
  const mainLength = mainText.replace(/[,₩\s]/g, "").length;
  const fontSize = mainLength >= 12 ? "xl" : mainLength >= 9 ? "2xl" : "3xl";

  return (
    <Box
      w="full"
      bg="gray.50"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      px={4}
      py={3}
    >
      {/* 상단: 통화 토글 + 환율 */}
      {isForeignCurrency && (
        <HStack justify="space-between" align="center" mb={1}>
          <HStack
            gap={1}
            as="button"
            onClick={onToggleCurrency}
            color="teal.600"
            fontSize="xs"
            fontWeight="medium"
          >
            <ArrowLeftRight size={12} />
            <Text>
              {currencyType === "KRW" ? "현지화로 입력하기" : "원화로 입력하기"}
            </Text>
          </HStack>
          {estimatedKrw && (
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              ≈ {estimatedKrw}원
            </Text>
          )}
        </HStack>
      )}

      {/* 수식 행: = 후에만 표시 */}
      <Box minH="18px" textAlign="right">
        {isEvaluated && (
          <Text fontSize="sm" color="gray.500">
            {expression}
          </Text>
        )}
      </Box>

      {/* 메인 행 */}
      <Text
        fontSize={fontSize}
        fontWeight="bold"
        textAlign="right"
        color={displayValue === "0" && !hasExpression ? "gray.400" : "gray.800"}
        lineHeight="1.2"
      >
        {mainText}
      </Text>
    </Box>
  );
}
