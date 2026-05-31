import { Box, Container, Flex, Skeleton, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

export default function ExpenseSkeleton() {
  return (
    <PageLayout style={{ paddingBottom: "60px" }}>
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

      {/* 날짜 탭 자리 */}
      <Skeleton h="36px" w="full" borderRadius="md" />

      <Container maxW="6xl" pt={3} pb={6} px={1}>
        <VStack align="stretch" gap={3}>
          {/* 요약 카드 자리 */}
          <Skeleton h="120px" w="full" borderRadius="xl" />

          {/* 경비 리스트 자리 */}
          <Skeleton h="240px" w="full" borderRadius="xl" />
        </VStack>
      </Container>
    </PageLayout>
  );
}
