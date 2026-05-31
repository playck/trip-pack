import { Box, Flex, Skeleton, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";

export default function SettlementSkeleton() {
  return (
    <PageLayout style={{ paddingBottom: "60px" }}>
      {/* 헤더 자리 (뒤로가기 + 정산 리포트 + 공유) */}
      <Flex
        align="center"
        justify="space-between"
        py={3}
        position="sticky"
        top={0}
        bg="white"
        zIndex={10}
      >
        <Skeleton h="20px" w="120px" borderRadius="md" />
        <Skeleton h="20px" w="32px" borderRadius="md" />
      </Flex>

      <VStack align="stretch" gap={3} pb={4}>
        {/* 공동 경비 총액 / 분담 멤버 / 1인당 평균 자리 */}
        <Skeleton h="84px" w="full" borderRadius="xl" />
        <Skeleton h="84px" w="full" borderRadius="xl" />
        <Skeleton h="84px" w="full" borderRadius="xl" />

        {/* 세부 리포트 자리 */}
        <Box mt={2}>
          <Skeleton h="16px" w="100px" borderRadius="md" />
        </Box>
        <Skeleton h="200px" w="full" borderRadius="xl" />
        <Skeleton h="200px" w="full" borderRadius="xl" />
      </VStack>
    </PageLayout>
  );
}
