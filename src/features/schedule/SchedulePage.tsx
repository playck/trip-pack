import { useState } from "react";
import { Container, VStack, Text, HStack, Badge, Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";

import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { colors, textColors } from "@/shared/constants/colors";
import { formatTripDateRange } from "@/shared/utiles/date";
import { GoogleMapView, DayScheduleList, AddScheduleSheet } from "./components";
import { useGeocoding, useCreateSchedule } from "./hooks";
import type { PlaceResult } from "./hooks";

function SchedulePageContent() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{
    dayNumber: number;
    date: string;
  } | null>(null);

  const { coordinates: regionCoordinates } = useGeocoding(
    tripInfo?.regionName,
    tripInfo?.regionId
  );

  const mapCenter = regionCoordinates || { lat: 37.5665, lng: 126.978 };

  const createScheduleMutation = useCreateSchedule(tripId || "", {
    onSuccess: () => {
      console.log("✅ 일정이 성공적으로 추가되었습니다");
    },
  });

  const handleAddSchedule = (dayNumber: number, date: string) => {
    setSelectedDay({ dayNumber, date });
    setIsSheetOpen(true);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    if (!tripId || !selectedDay) {
      return;
    }

    createScheduleMutation.mutate({
      tripId,
      dayNumber: selectedDay.dayNumber,
      scheduleDate: selectedDay.date,
      placeId: place.placeId,
      placeName: place.name,
      placeAddress: place.address,
      latitude: place.location?.lat,
      longitude: place.location?.lng,
    });
  };

  // TODO: 실제 일정 데이터로 교체 예정
  const scheduleMarkers: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    label: number;
  }> = [];

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
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={textColors.primary}
                >
                  {tripInfo.title || `${tripInfo.regionName} 여행지`}
                </Text>
                <HStack gap={2} flexWrap="wrap" align="center">
                  <Text fontSize="sm" color={textColors.tertiary}>
                    {formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
                  </Text>
                  {tripInfo.companionTypes &&
                    tripInfo.companionTypes.length > 0 && (
                      <>
                        <Text fontSize="sm" color={textColors.subtle}>
                          •
                        </Text>
                        <HStack gap={1}>
                          {tripInfo.companionTypes.map((companion) => (
                            <Badge
                              key={companion}
                              size="sm"
                              variant="subtle"
                              colorPalette={colors.secondary.palette}
                            >
                              {companion}
                            </Badge>
                          ))}
                        </HStack>
                      </>
                    )}
                  {tripInfo.tripTypes && tripInfo.tripTypes.length > 0 && (
                    <>
                      <Text fontSize="sm" color={textColors.subtle}>
                        •
                      </Text>
                      <HStack gap={1}>
                        {tripInfo.tripTypes.map((type) => (
                          <Badge
                            key={type}
                            size="sm"
                            variant="outline"
                            colorPalette={colors.accent.palette}
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

          <Box h="400px" w="full">
            <GoogleMapView
              center={mapCenter}
              zoom={13}
              height="400px"
              markers={scheduleMarkers}
            />
          </Box>

          {/* 일정표 */}
          {tripInfo && tripId && (
            <DayScheduleList
              tripId={tripId}
              startDate={tripInfo.startDate}
              endDate={tripInfo.endDate}
              onAddSchedule={handleAddSchedule}
              onAddMemo={(dayNumber, date) =>
                console.log(`${dayNumber}일차 메모 추가 (${date})`)
              }
            />
          )}
        </VStack>

        {/* 일정 추가 바텀시트 */}
        {selectedDay && (
          <AddScheduleSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSelectPlace={handleSelectPlace}
            dayNumber={selectedDay.dayNumber}
            date={selectedDay.date}
          />
        )}
      </Container>
    </PageLayout>
  );
}

export default function SchedulePage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <PageLayout>
        <Container maxW="6xl" py={5} px={0}>
          <Box
            p={8}
            borderRadius="lg"
            bg="red.50"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="red.700">
              Google Maps API 키가 설정되지 않았습니다.
            </Text>
          </Box>
        </Container>
      </PageLayout>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <SchedulePageContent />
    </APIProvider>
  );
}
