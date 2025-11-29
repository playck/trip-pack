import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import SwipeableExpenseItem from "./SwipeableExpenseItem";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  tripId: string;
}

const DATE_TAB_HEIGHT = 50;

export default function ExpenseList({ expenses, tripId }: ExpenseListProps) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      {/* 총 비용 - 상단 고정 */}
      {expenses.length > 0 && (
        <Box
          position="sticky"
          top={`${HEADER_HEIGHT + DATE_TAB_HEIGHT}px`}
          p={3}
          zIndex={9}
          bg="white"
          borderBottom="2px solid"
          borderColor="gray.200"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
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
                {total.toLocaleString()}
              </Text>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={colors.primary.palette}
              >
                원
              </Text>
            </HStack>
          </Flex>
        </Box>
      )}

      {/* 경비 목록 */}
      <VStack align="stretch" gap={0} mt={2}>
        {expenses.length === 0 ? (
          <Box py={8} textAlign="center">
            <Text color="gray.400" fontSize="sm">
              경비 내역이 없습니다
            </Text>
          </Box>
        ) : (
          <>
            {expenses.map((expense, index) => (
              <SwipeableExpenseItem
                key={expense.id}
                expense={expense}
                tripId={tripId}
                showBorder={index < expenses.length - 1}
              />
            ))}
          </>
        )}
      </VStack>
    </>
  );
}
