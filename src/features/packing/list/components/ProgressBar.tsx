import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { ChecklistProgress } from "../utils/progressCalculator";

interface ProgressBarProps {
  progress: ChecklistProgress;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const { totalItems, checkedItems, progressPercentage } = progress;

  return (
    <VStack gap={2} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          체크율
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color={colors.primary.fg}>
          ({progressPercentage}%) {checkedItems}/{totalItems}
        </Text>
      </HStack>

      <Box w="full" h="2" bg="gray.200" borderRadius="full" overflow="hidden">
        <Box
          h="full"
          bg={colors.primary.solid}
          borderRadius="full"
          width={`${progressPercentage}%`}
          transition="width 0.3s ease"
        />
      </Box>
    </VStack>
  );
}
