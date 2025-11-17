import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import SwipeableExpenseItem from "./SwipeableExpenseItem";

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

export default function ExpenseDaySection({
  dayNumber,
  date,
  expenses,
  tripId,
}: ExpenseDaySectionProps) {
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <VStack align="stretch" gap={3}>
      {/* 날짜 헤더 */}
      <Flex
        justify="space-between"
        align="center"
        py={1.5}
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
            {totalAmount.toLocaleString()}
          </Text>
          <Text fontSize="md" fontWeight="bold" color={colors.primary.palette}>
            원
          </Text>
        </HStack>
      </Flex>

      {/* 경비 목록 */}
      {expenses.length === 0 ? (
        <Box py={4} textAlign="center">
          <Text color="gray.400" fontSize="sm">
            경비 내역이 없습니다
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={0} px={2}>
          {expenses.map((expense, index) => (
            <SwipeableExpenseItem
              key={expense.id}
              expense={expense}
              tripId={tripId}
              showBorder={index < expenses.length - 1}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
}
