import { Container, VStack, Text, Box } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";

export const ScheduleLoadingState = () => (
  <PageLayout>
    <LoadingSpinner
      message="여행 일정을 불러오고 있어요..."
      centered
      fullScreen
    />
  </PageLayout>
);

export const ScheduleErrorState = ({ error }: { error: unknown }) => (
  <PageLayout>
    <ErrorMessage
      message={
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다"
      }
      title="여행 일정 불러오기 실패"
      centered
      fullScreen
    />
  </PageLayout>
);

export const ScheduleEmptyState = () => (
  <PageLayout>
    <Container maxW="6xl" pb={5} px={0}>
      <VStack gap={4} py={8}>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          여행을 선택해주세요
        </Text>
      </VStack>
    </Container>
  </PageLayout>
);

export const ApiKeyMissingState = () => (
  <PageLayout>
    <Container maxW="6xl" py={5} px={0}>
      <Box
        p={8}
        borderRadius="lg"
        bg="red.50"
        borderWidth="1px"
        borderColor="red.200"
      >
        <Text color="red.700">Google Maps API 키가 설정되지 않았습니다.</Text>
      </Box>
    </Container>
  </PageLayout>
);
