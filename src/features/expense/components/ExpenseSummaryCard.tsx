import { useState } from "react";
import { useAtom } from "jotai";
import { Box, Flex, Text, VStack, HStack, Button } from "@chakra-ui/react";
import {
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import { colors, statusColors } from "@/shared/constants/colors";
import { useTripCurrency } from "../hooks/useTripCurrency";
import { showLocalCurrencyAtom } from "../store/currencyStore";
import { formatAmount } from "../utils/helper";
import { useUpdateTripBudget } from "../services";
import ExpenseSummaryItem from "./ExpenseSummaryItem";
import SetBudgetModal from "./SetBudgetModal";

interface ExpenseSummaryCardProps {
  totalAmount: number;
  averagePerDay: number;
  maxDayAmount: number;
  maxDayDate: string;
  tripId: string;
}

export default function ExpenseSummaryCard({
  totalAmount,
  averagePerDay,
  maxDayAmount,
  maxDayDate,
  tripId,
}: ExpenseSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const updateBudgetMutation = useUpdateTripBudget(tripId);

  const [showLocalCurrency, setShowLocalCurrency] = useAtom(
    showLocalCurrencyAtom,
  );

  const {
    tripInfo,
    targetCurrency,
    currencySymbol,
    isForeignCurrency,
    exchangeRate,
    isRateLoading,
  } = useTripCurrency(tripId);
  const budget = tripInfo?.budget || null;

  const handleSaveBudget = (newBudget: number | null) => {
    updateBudgetMutation.mutate(newBudget);
  };

  const getFormattedAmount = (amount: number) => {
    return formatAmount(amount, {
      showLocalCurrency,
      isForeignCurrency,
      exchangeRate,
      targetCurrency,
      currencySymbol,
    });
  };

  const hasBudget = budget !== null && budget > 0;
  const remainingAmount = hasBudget ? budget - totalAmount : 0;
  const usagePercent = hasBudget
    ? Math.min((totalAmount / budget) * 100, 100)
    : 0;
  const isOverBudget = remainingAmount < 0;
  const errorColor = `${statusColors.error.palette}.500`;

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        {/* 헤더 */}
        <Flex
          justify="space-between"
          align="center"
          px={4}
          py={3}
          bg={hasBudget ? "white" : `${colors.primary.palette}.50`}
          transition="all 0.2s"
          cursor="pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <HStack gap={3} flex={1}>
            <Box
              p={2}
              borderRadius="full"
              bg={hasBudget ? `${colors.primary.palette}.50` : "white"}
            >
              {hasBudget ? (
                <Wallet size={20} color={colors.primary.palette} />
              ) : (
                <TrendingUp size={20} color={colors.primary.palette} />
              )}
            </Box>

            <VStack align="flex-start" gap={0} flex={1}>
              <HStack gap={2} align="center">
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  {hasBudget ? "남은 예산" : "총 지출"}
                </Text>

                {/* 환율 정보 (심플하게 표시) */}
                {isForeignCurrency && !isRateLoading && exchangeRate && (
                  <Text fontSize="10px" color="gray.400" lineHeight="shorter">
                    {currencySymbol}1 ≈{" "}
                    {Math.round(exchangeRate).toLocaleString()}원
                  </Text>
                )}

                {/* 현지화 토글 버튼 */}
                {isForeignCurrency && (
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    h="18px"
                    px={1}
                    minW="auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocalCurrency(!showLocalCurrency);
                    }}
                  >
                    <HStack gap={1}>
                      <ArrowLeftRight size={10} />
                      <Text fontSize="xs" fontWeight="medium">
                        {showLocalCurrency ? "원화" : "현지화"}
                      </Text>
                    </HStack>
                  </Button>
                )}
              </HStack>
              {(() => {
                const { value, unit } = getFormattedAmount(
                  hasBudget ? remainingAmount : totalAmount,
                );
                return (
                  <HStack gap={1} align="baseline">
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={isOverBudget ? errorColor : "gray.800"}
                    >
                      {unit !== "원" && unit}
                      {value}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {unit === "원" ? "원" : ""}
                    </Text>
                  </HStack>
                );
              })()}
            </VStack>
          </HStack>

          <VStack align="flex-end" gap={1}>
            {/* 우측 상단 버튼 영역 */}
            <HStack gap={2}>
              <Button
                size="xs"
                variant="surface"
                colorPalette="teal"
                h="24px"
                px={2}
                fontSize="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBudgetModalOpen(true);
                }}
              >
                {hasBudget ? "예산 수정" : "예산 설정"}
              </Button>
              <Box color="gray.400">
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </Box>
            </HStack>
          </VStack>
        </Flex>

        {/* 예산 진행률 바 (예산 있을 때만) */}
        {hasBudget && (
          <Box px={4} pb={3}>
            <Box
              w="full"
              h="8px"
              bg="gray.100"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="full"
                w={`${usagePercent}%`}
                bg={isOverBudget ? errorColor : colors.primary.palette}
                transition="width 0.3s ease"
              />
            </Box>
            <Flex justify="space-between" mt={1}>
              <Text fontSize="xs" color="gray.500">
                {usagePercent.toFixed(0)}% 사용
              </Text>
              <Text fontSize="xs" color="gray.500">
                총 {getFormattedAmount(budget).full}
              </Text>
            </Flex>
          </Box>
        )}

        {/* 상세 정보 */}
        {isExpanded && (
          <VStack align="stretch" borderTop="1px solid" borderColor="gray.100">
            {/* 통계 리스트 */}
            <Box px={4} py={1} bg="gray.50">
              {hasBudget && (
                <ExpenseSummaryItem
                  label="총 지출"
                  value={getFormattedAmount(totalAmount).full}
                />
              )}

              <ExpenseSummaryItem
                label="일 평균 지출"
                value={getFormattedAmount(averagePerDay).full}
              />

              <ExpenseSummaryItem
                label="최대 지출일"
                value={getFormattedAmount(maxDayAmount).full}
                subValue={maxDayDate}
                isLast
              />
            </Box>
          </VStack>
        )}
      </Box>

      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={budget}
        onSave={handleSaveBudget}
        tripId={tripId}
      />
    </>
  );
}
