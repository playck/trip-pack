import { Flex, HStack, Text } from "@chakra-ui/react";

interface ExpenseSummaryItemProps {
  label: string;
  value: string;
  subValue?: string;
  isLast?: boolean;
}

export const ExpenseSummaryItem = ({
  label,
  value,
  subValue,
  isLast = false,
}: ExpenseSummaryItemProps) => (
  <Flex
    justify="space-between"
    align="center"
    py={1}
    borderBottom={isLast ? "none" : "1px dashed"}
    borderColor="gray.200"
  >
    <HStack gap={2}>
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
    </HStack>
    <HStack gap={2}>
      {subValue && (
        <Text fontSize="xs" color="gray.400">
          {subValue}
        </Text>
      )}
      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
        {value}
      </Text>
    </HStack>
  </Flex>
);
