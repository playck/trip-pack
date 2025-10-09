import { Container, VStack, Text, HStack, Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";
import { useTripInfo } from "@/shared/hooks/useTripQuery";

export default function SchedulePage() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSpinner
          message="여행 일정을 불러오고 있어요..."
          centered
          fullScreen
        />
      </PageLayout>
    );
  }

  if (error) {
    return (
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
  }

  if (!tripId) {
    return (
      <PageLayout>
        <Container maxW="6xl" py={5} px={0}>
          <VStack gap={4} py={8}>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              여행을 선택해주세요
            </Text>
          </VStack>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxW="6xl" py={5} px={0}>
        <VStack gap={4} align="stretch">
          {/* 헤더 */}
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between" align="center">
              <HStack gap={2}>
                <Calendar size={24} />
                <Text fontSize="2xl" fontWeight="bold">
                  여행 일정표
                </Text>
              </HStack>
            </HStack>
            {tripInfo && (
              <Text fontSize="md" color="gray.600">
                {tripInfo.regionName || "여행지"} 일정
              </Text>
            )}
          </VStack>
        </VStack>
      </Container>
    </PageLayout>
  );
}
