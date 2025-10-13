import { Container, VStack, Text, HStack, Badge, Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { GoogleMapView } from "./components";

export default function SchedulePage() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);

  // 테스트용 샘플 마커들 (서울 주요 관광지)
  const sampleMarkers = [
    {
      id: "1",
      position: { lat: 37.5665, lng: 126.978 }, // 서울 시청
      title: "서울 시청",
      label: 1,
    },
    {
      id: "2",
      position: { lat: 37.5796, lng: 126.977 }, // 경복궁
      title: "경복궁",
      label: 2,
    },
    {
      id: "3",
      position: { lat: 37.5701, lng: 126.9868 }, // 명동
      title: "명동",
      label: 3,
    },
    {
      id: "4",
      position: { lat: 37.5511, lng: 126.9882 }, // 남산타워
      title: "N서울타워",
      label: 4,
    },
  ];

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
            center={{ lat: 37.5665, lng: 126.978 }}
            zoom={13}
            height="400px"
            markers={sampleMarkers}
          />

          {/* 일정 목록 (샘플) */}
          <VStack align="stretch" gap={2}>
            <Text fontSize="lg" fontWeight="bold">
              여행 일정
            </Text>
            {sampleMarkers.map((marker, index) => (
              <Box
                key={marker.id}
                p={3}
                bg="white"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                cursor="pointer"
              >
                <HStack gap={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.600"
                    minW="20px"
                  >
                    {index + 1}
                  </Text>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="md" fontWeight="semibold">
                      {marker.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {marker.position.lat.toFixed(4)},{" "}
                      {marker.position.lng.toFixed(4)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Container>
    </PageLayout>
  );
}
