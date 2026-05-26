import { useAtomValue } from "jotai";
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import ExpenseItem from "./ExpenseItem";
import type { ExpenseItemData } from "../types";
import { useTripCurrency } from "../hooks/useTripCurrency";
import { showLocalCurrencyAtom } from "../store/currencyStore";
import { formatAmount } from "../utils/helper";

interface ExpenseListProps {
  expenses: ExpenseItemData[];
  tripId: string;
  selectedDate?: string;
}

export default function ExpenseList({
  expenses,
  tripId,
  selectedDate,
}: ExpenseListProps) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const showLocalCurrency = useAtomValue(showLocalCurrencyAtom);
  const { targetCurrency, currencySymbol, isForeignCurrency, exchangeRate } =
    useTripCurrency(tripId);

  const { value: totalValue, unit: totalUnit } = formatAmount(total, {
    showLocalCurrency,
    isForeignCurrency,
    exchangeRate,
    targetCurrency,
    currencySymbol,
  });

  return (
    <>
      {/* 총 비용 - 상단 고정 */}
      {expenses.length > 0 && (
        <Box
          position="sticky"
          top="105px"
          zIndex={8}
          py={1}
          px={3}
          bg={`${colors.primary.palette}.50`}
          borderRadius="lg"
          borderLeft="4px solid"
          borderColor={colors.primary.solid}
        >
          <Flex justify="space-between" align="center" maxW="6xl" mx="auto">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              총 비용
            </Text>
            <HStack gap={0.5} align="baseline">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={colors.primary.palette}
              >
                {totalUnit !== "원" && totalUnit}
                {totalValue}
              </Text>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={colors.primary.palette}
              >
                {totalUnit === "원" ? "원" : ""}
              </Text>
            </HStack>
          </Flex>
        </Box>
      )}

      {/* 경비 목록 */}
      <VStack align="stretch" gap={0} mt={2}>
        {expenses.length === 0 ? (
          <Box py={1} textAlign="center">
            <Text color="gray.400" fontSize="sm">
              경비 내역이 없습니다
            </Text>
          </Box>
        ) : (
          <Box px={2} pr={0}>
            {expenses.map((expense, index) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                tripId={tripId}
                showBorder={index < expenses.length - 1}
                exchangeInfo={{
                  showLocalCurrency,
                  exchangeRate: exchangeRate || 0,
                  currencySymbol,
                  isForeignCurrency,
                }}
                selectedDate={selectedDate}
              />
            ))}
          </Box>
        )}
      </VStack>
    </>
  );
}
