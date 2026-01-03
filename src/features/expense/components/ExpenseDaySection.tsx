import { useAtom } from "jotai";
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { useExchangeRate } from "@/shared/service/trip/useExchangeRate";
import {
  getCurrencyByCountryCode,
  getCurrencySymbol,
} from "@/shared/utiles/currency";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { showLocalCurrencyAtom } from "../store/currencyStore";
import { formatAmount } from "../utils/helper";
import ExpenseItem from "./ExpenseItem";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseDaySectionProps {
  dayNumber: number;
  date: string;
  expenses: ExpenseItem[];
  tripId: string;
}

const DATE_TAB_HEIGHT = 55;

export default function ExpenseDaySection({
  dayNumber,
  date,
  expenses,
  tripId,
}: ExpenseDaySectionProps) {
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const { data: tripInfo } = useTripInfo(tripId);
  const [showLocalCurrency] = useAtom(showLocalCurrencyAtom);
  const targetCurrency = getCurrencyByCountryCode(tripInfo?.countryCode);
  const currencySymbol = getCurrencySymbol(targetCurrency);
  const isForeignCurrency = targetCurrency.toLowerCase() !== "krw";

  const { rate: exchangeRate } = useExchangeRate(targetCurrency, "krw", {
    enabled: isForeignCurrency,
  });

  const { value: totalValue, unit: totalUnit } = formatAmount(totalAmount, {
    showLocalCurrency,
    isForeignCurrency,
    exchangeRate: exchangeRate || 0,
    targetCurrency,
    currencySymbol,
  });

  return (
    <VStack align="stretch" gap={2}>
      {/* 날짜 헤더 - Header + DateTabList 바로 아래 */}
      <Flex
        position="sticky"
        top={`${HEADER_HEIGHT + DATE_TAB_HEIGHT}px`}
        zIndex={8}
        justify="space-between"
        align="center"
        py={1}
        px={3}
        bg={`${colors.primary.palette}.50`}
        borderRadius="lg"
        borderLeft="4px solid"
        borderColor={colors.primary.palette}
      >
        <Flex align="baseline" gap={2}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Day {dayNumber}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {date}
          </Text>
        </Flex>
        <HStack gap={0.5} align="baseline">
          <Text fontSize="lg" fontWeight="bold" color={colors.primary.palette}>
            {totalUnit !== "원" && totalUnit}
            {totalValue}
          </Text>
          <Text fontSize="md" fontWeight="bold" color={colors.primary.palette}>
            {totalUnit === "원" ? "원" : ""}
          </Text>
        </HStack>
      </Flex>

      {/* 경비 목록 */}
      {expenses.length === 0 ? (
        <Box py={1} textAlign="center">
          <Text color="gray.400" fontSize="sm">
            경비 내역이 없습니다
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={0} px={2} pr={0}>
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
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
}
