import { Box, Flex, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { TrendingUp, ChevronUp, ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";

interface ExpenseSummaryCardProps {
  totalAmount: number;
  averagePerDay: number;
  maxDayAmount: number;
  maxDayDate: string;
  budget: number | null;
  onEditBudget?: () => void;
}

export default function ExpenseSummaryCard({
  totalAmount,
  averagePerDay,
  maxDayAmount,
  maxDayDate,
  budget,
  onEditBudget,
}: ExpenseSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasBudget = budget !== null && budget > 0;
  const remainingAmount = hasBudget ? budget - totalAmount : 0;
  const usagePercent = hasBudget
    ? Math.min((totalAmount / budget) * 100, 100)
    : 0;
  const isOverBudget = remainingAmount < 0;

  return (
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
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              {hasBudget ? "남은 예산" : "총 지출"}
            </Text>
            <HStack gap={1} align="baseline">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={isOverBudget ? "red.500" : "gray.800"}
              >
                {hasBudget
                  ? remainingAmount.toLocaleString()
                  : totalAmount.toLocaleString()}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                원
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <HStack gap={4}>
          {!hasBudget && (
            <Button
              size="xs"
              variant="surface"
              colorPalette="teal"
              h="24px"
              px={2}
              fontSize="xs"
              onClick={(e) => {
                e.stopPropagation();
                onEditBudget?.();
              }}
            >
              예산 설정
            </Button>
          )}
          <Box color="gray.400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Box>
        </HStack>
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
              bg={isOverBudget ? "red.500" : colors.primary.palette}
              transition="width 0.3s ease"
            />
          </Box>
          <Flex justify="space-between" mt={1}>
            <Text fontSize="xs" color="gray.500">
              {usagePercent.toFixed(0)}% 사용
            </Text>
            <Text fontSize="xs" color="gray.500">
              총 {budget.toLocaleString()}원
            </Text>
          </Flex>
        </Box>
      )}

      {/* 상세 정보 */}
      {isExpanded && (
        <VStack
          align="stretch"
          gap={0}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          {/* 통계 리스트 */}
          <Box px={4} py={2} bg="gray.50">
            {hasBudget && (
              <Flex
                justify="space-between"
                align="center"
                py={1}
                borderBottom="1px dashed"
                borderColor="gray.200"
              >
                <Text fontSize="sm" color="gray.600">
                  총 지출
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                  {totalAmount.toLocaleString()}원
                </Text>
              </Flex>
            )}

            <Flex
              justify="space-between"
              align="center"
              py={1}
              borderBottom="1px dashed"
              borderColor="gray.200"
            >
              <HStack gap={2}>
                <Text fontSize="sm" color="gray.600">
                  일 평균 지출
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                {averagePerDay.toLocaleString()}원
              </Text>
            </Flex>

            <Flex justify="space-between" align="center" py={1}>
              <HStack gap={2}>
                <Text fontSize="sm" color="gray.600">
                  최대 지출일
                </Text>
              </HStack>
              <HStack gap={2}>
                <Text fontSize="xs" color="gray.400">
                  {maxDayDate}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                  {maxDayAmount.toLocaleString()}원
                </Text>
              </HStack>
            </Flex>

            {/* 예산 수정 버튼 (예산 있을 때) */}
            {hasBudget && (
              <Flex
                justify="flex-end"
                pt={2}
                mt={1}
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  fontWeight="normal"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditBudget?.();
                  }}
                >
                  예산 수정
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      )}
    </Box>
  );
}
