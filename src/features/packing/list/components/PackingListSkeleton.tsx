import { Box, Container, Flex, Skeleton, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

export default function PackingListSkeleton() {
  return (
    <PageLayout>
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

      <Container maxW="6xl" pt={1} pb={6} px={0}>
        <VStack gap={4} align="stretch" pb="100px">
          {/* 체크율 + 뷰 모드 토글 자리 */}
          <Skeleton h="28px" w="full" borderRadius="md" />

          {/* 섹션 자리 (준비물 / 쇼핑 / 할일) */}
          <Skeleton h="220px" w="full" borderRadius="xl" />
          <Skeleton h="180px" w="full" borderRadius="xl" />
          <Skeleton h="180px" w="full" borderRadius="xl" />
        </VStack>
      </Container>
    </PageLayout>
  );
}
