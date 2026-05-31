import { Box, Container, Skeleton, VStack } from "@chakra-ui/react";

import { HEADER_HEIGHT } from "@/shared/constants/layout";

export default function CategoryDetailSkeleton() {
  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={0} px={0}>
        <VStack gap={0} align="stretch">
          {/* 헤더 자리 (대충) */}
          <Box
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            px={4}
            py={2}
            position="sticky"
            top={`${HEADER_HEIGHT}px`}
            zIndex={100}
          >
            <VStack align="stretch" gap={2}>
              <Skeleton h="28px" w="full" borderRadius="md" />
              <Skeleton h="40px" w="full" borderRadius="md" />
            </VStack>
          </Box>

          {/* 아이템 리스트 자리 (가로 막대기 세로 나열) */}
          <Box px={5} py={3}>
            <VStack align="stretch" gap={2}>
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
              <Skeleton h="56px" w="full" borderRadius="lg" />
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
