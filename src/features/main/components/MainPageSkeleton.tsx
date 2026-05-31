import { Box, Skeleton, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";

export default function MainPageSkeleton() {
  return (
    <PageLayout>
      <Box w="full" py={3}>
        <VStack gap={3} align="stretch">
          {/* IntroBanner 자리 */}
          <Skeleton h="76px" w="full" borderRadius="2xl" />

          {/* 여행 리스트 자리 */}
          <Skeleton h="120px" w="full" borderRadius="xl" />
          <Skeleton h="120px" w="full" borderRadius="xl" />
        </VStack>
      </Box>
    </PageLayout>
  );
}
