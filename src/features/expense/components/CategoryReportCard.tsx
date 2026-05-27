import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import type { CategoryBucket } from "../utils/reportAggregations";

interface CategoryReportCardProps {
  buckets: CategoryBucket[];
  formatAmount: (amount: number) => { value: string; unit: string };
}

export default function CategoryReportCard({
  buckets,
  formatAmount,
}: CategoryReportCardProps) {
  if (buckets.length === 0) return null;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
    >
      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
        카테고리별 지출
      </Text>

      <VStack align="stretch" gap={3}>
        {buckets.map((bucket) => {
          const Icon = bucket.def.icon;
          const { value, unit } = formatAmount(bucket.amount);
          const percent = Math.round(bucket.ratio * 100);
          const barColor = `${bucket.def.color}.400`;
          const iconBg = `${bucket.def.color}.50`;
          const iconColor = `var(--chakra-colors-${bucket.def.color}-500)`;

          return (
            <Box key={bucket.def.id}>
              <Flex justify="space-between" align="center" mb={1.5}>
                <HStack gap={2}>
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={iconBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon size={14} color={iconColor} />
                  </Box>
                  <Text fontSize="sm" color="gray.700" fontWeight="medium">
                    {bucket.def.label}
                  </Text>
                  <Text fontSize="2xs" color="gray.400">
                    {percent}%
                  </Text>
                </HStack>
                <HStack gap={0.5} align="baseline">
                  <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                    {unit !== "원" && unit}
                    {value}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {unit === "원" ? "원" : ""}
                  </Text>
                </HStack>
              </Flex>
              <Box w="full" h="6px" bg="gray.100" borderRadius="full">
                <Box
                  h="full"
                  w={`${Math.max(percent, 2)}%`}
                  bg={barColor}
                  borderRadius="full"
                  transition="width 0.3s ease"
                />
              </Box>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
