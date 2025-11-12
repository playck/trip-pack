import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <VStack align="stretch" gap={0}>
      {expenses.length === 0 ? (
        <Box py={8} textAlign="center">
          <Text color="gray.400" fontSize="sm">
            경비 내역이 없습니다
          </Text>
        </Box>
      ) : (
        <>
          {expenses.map((expense, index) => (
            <Flex
              key={expense.id}
              justify="space-between"
              align="center"
              py={2}
              borderBottom={
                index < expenses.length - 1 ? "1px solid" : undefined
              }
              borderColor="gray.100"
            >
              <Text fontSize="15px" color="gray.700">
                {expense.name}
              </Text>
              <HStack gap={0.5} align="baseline">
                <Text fontSize="md" fontWeight="semibold" color="gray.900">
                  {expense.amount.toLocaleString()}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                  원
                </Text>
              </HStack>
            </Flex>
          ))}

          <Box borderBottom="1px dashed" borderColor="gray.200" mt={2} />

          <Flex justify="space-between" align="center" py={2}>
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
        </>
      )}
    </VStack>
  );
}
