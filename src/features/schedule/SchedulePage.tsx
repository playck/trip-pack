import { Container, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { GoogleMapView } from "./components";

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
          <VStack align="stretch" gap={3}>
            {tripInfo && (
              <VStack align="stretch" gap={2}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {tripInfo.title || `${tripInfo.regionName} 여행지`}
                </Text>
                <HStack gap={2} flexWrap="wrap" align="center">
                  <Text fontSize="sm" color="gray.600">
                    {formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
                  </Text>
                  {tripInfo.companionTypes &&
                    tripInfo.companionTypes.length > 0 && (
                      <>
                        <Text fontSize="sm" color="gray.400">
                          •
                        </Text>
                        <HStack gap={1}>
                          {tripInfo.companionTypes.map((companion) => (
                            <Badge
                              key={companion}
                              size="sm"
                              variant="subtle"
                              colorPalette="blue"
                            >
                              {companion}
                            </Badge>
                          ))}
                        </HStack>
                      </>
                    )}
                  {tripInfo.tripTypes && tripInfo.tripTypes.length > 0 && (
                    <>
                      <Text fontSize="sm" color="gray.400">
                        •
                      </Text>
                      <HStack gap={1}>
                        {tripInfo.tripTypes.map((type) => (
                          <Badge
                            key={type}
                            size="sm"
                            variant="outline"
                            colorPalette="purple"
                          >
                            {type}
                          </Badge>
                        ))}
                      </HStack>
                    </>
                  )}
                </HStack>
              </VStack>
            )}
          </VStack>

          <GoogleMapView
            center={
              tripInfo?.regionName ? undefined : { lat: 37.5665, lng: 126.978 }
            }
            zoom={13}
            height="300px"
          />
        </VStack>
      </Container>
    </PageLayout>
  );
}
