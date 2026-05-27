import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { DailyBucket } from "../utils/reportAggregations";

interface DailyTrendCardProps {
  buckets: DailyBucket[];
  formatAmount: (amount: number) => { value: string; unit: string };
}

const CHART_HEIGHT = 120;
const BAR_MIN_WIDTH = 32;

export default function DailyTrendCard({
  buckets,
  formatAmount,
}: DailyTrendCardProps) {
  const nonZeroBuckets = buckets.filter((b) => b.amount > 0);
  if (nonZeroBuckets.length === 0) return null;

  const max = Math.max(...buckets.map((b) => b.amount));
  const totalSpent = nonZeroBuckets.reduce((sum, b) => sum + b.amount, 0);
  const average = Math.round(totalSpent / nonZeroBuckets.length);
  const averagePercent = max > 0 ? (average / max) * 100 : 0;
  const primary = colors.primary.palette;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
          일자별 지출 트렌드
        </Text>
        <HStack gap={1}>
          <Text fontSize="2xs" color="gray.500">
            일 평균
          </Text>
          <Text fontSize="2xs" color="gray.700" fontWeight="semibold">
            {formatAmount(average).value}
            {formatAmount(average).unit === "원"
              ? "원"
              : formatAmount(average).unit}
          </Text>
        </HStack>
      </Flex>

      <Box
        position="relative"
        overflowX="auto"
        css={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box position="relative" minW="full" h={`${CHART_HEIGHT + 40}px`}>
          {/* 평균선 */}
          {average > 0 && (
            <Box
              position="absolute"
              left={0}
              right={0}
              bottom={`${40 + averagePercent * (CHART_HEIGHT / 100)}px`}
              borderTop="1px dashed"
              borderColor="gray.300"
              zIndex={1}
              pointerEvents="none"
            />
          )}

          {/* 막대들 */}
          <HStack
            align="flex-end"
            gap={1.5}
            h={`${CHART_HEIGHT}px`}
            position="absolute"
            bottom="40px"
            left={0}
            right={0}
          >
            {buckets.map((bucket) => {
              const heightPercent =
                max > 0 ? (bucket.amount / max) * 100 : 0;
              const isMax = bucket.amount === max && bucket.amount > 0;
              const barColor = isMax ? `${primary}.500` : `${primary}.200`;

              return (
                <VStack
                  key={bucket.dayNumber}
                  gap={0}
                  minW={`${BAR_MIN_WIDTH}px`}
                  flex={1}
                  align="stretch"
                  justify="flex-end"
                  h="full"
                >
                  <Box
                    h={`${heightPercent}%`}
                    minH={bucket.amount > 0 ? "2px" : "0"}
                    bg={barColor}
                    borderRadius="md md 0 0"
                    transition="height 0.3s ease"
                  />
                </VStack>
              );
            })}
          </HStack>

          {/* 라벨 */}
          <HStack
            gap={1.5}
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="40px"
            align="flex-start"
            pt={2}
          >
            {buckets.map((bucket) => (
              <VStack
                key={bucket.dayNumber}
                gap={0}
                minW={`${BAR_MIN_WIDTH}px`}
                flex={1}
              >
                <Text fontSize="2xs" color="gray.600" fontWeight="semibold">
                  D{bucket.dayNumber}
                </Text>
                <Text fontSize="2xs" color="gray.400">
                  {bucket.label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
