import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { TrendingUp, Award, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ExpenseSummaryCardProps {
  totalAmount: number;
  averagePerDay: number;
  maxDayAmount: number;
  maxDayDate: string;
}

export default function ExpenseSummaryCard({
  totalAmount,
  averagePerDay,
  maxDayAmount,
  maxDayDate,
}: ExpenseSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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
        py={2}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        bg={`${colors.primary.palette}.50`}
        transition="all 0.2s"
      >
        <HStack gap={2}>
          <TrendingUp size={20} color={colors.primary.palette} />
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            전체 통계
          </Text>
        </HStack>
        <HStack gap={2}>
          <HStack gap={0.5} align="baseline">
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={colors.primary.palette}
            >
              {totalAmount.toLocaleString()}
            </Text>
            <Text
              fontSize="md"
              fontWeight="bold"
              color={colors.primary.palette}
            >
              원
            </Text>
          </HStack>
          <Box color="gray.500">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Box>
        </HStack>
      </Flex>

      {/* 상세 정보 */}
      {isExpanded && (
        <VStack align="stretch" gap={0} px={3} bg="white">
          <Flex
            justify="space-between"
            align="center"
            py={2}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <HStack gap={2}>
              <TrendingUp size={18} color="#6B7280" />
              <Text fontSize="sm" color="gray.600">
                일 평균 지출
              </Text>
            </HStack>
            <HStack gap={0.5} align="baseline">
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                {averagePerDay.toLocaleString()}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                원
              </Text>
            </HStack>
          </Flex>

          <Flex justify="space-between" align="center" py={2}>
            <HStack gap={1}>
              <Award size={18} color={colors.primary.palette} />
              <Text fontSize="sm" color="gray.600">
                가장 많이 쓴 날
              </Text>
            </HStack>
            <HStack gap={1} align="baseline">
              <Text fontSize="sm" color="gray.500">
                {maxDayDate}
              </Text>
              <Text fontSize="sm" color="gray.400">
                ·
              </Text>
              <HStack gap={0.5} align="baseline">
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color={colors.primary.palette}
                >
                  {maxDayAmount.toLocaleString()}
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={colors.primary.palette}
                >
                  원
                </Text>
              </HStack>
            </HStack>
          </Flex>
        </VStack>
      )}
    </Box>
  );
}
