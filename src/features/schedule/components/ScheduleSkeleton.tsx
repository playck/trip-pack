import { Box, Flex, Skeleton, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

export default function ScheduleSkeleton() {
  return (
    <PageLayout>
      <VStack gap={3} align="stretch">
        {/* TripInfoHeader 자리 */}
        <Box
          as="header"
          w="full"
          h={`${TRIP_INFO_HEADER_HEIGHT}px`}
          bg="white"
          position="sticky"
          top={`${HEADER_HEIGHT}px`}
          zIndex={99}
        >
          <Flex align="center" h="full">
            <Skeleton h="18px" w="160px" borderRadius="md" />
          </Flex>
        </Box>

        {/* 지도 자리 */}
        <Skeleton w="full" h="200px" borderRadius="lg" />

        {/* 일자별 일정 자리 */}
        <Skeleton h="160px" w="full" borderRadius="xl" />
        <Skeleton h="160px" w="full" borderRadius="xl" />
        <Skeleton h="160px" w="full" borderRadius="xl" />
      </VStack>
    </PageLayout>
  );
}
