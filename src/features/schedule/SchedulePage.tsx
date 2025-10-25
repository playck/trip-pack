import { useState, useMemo } from "react";
import { Container, VStack, Text, Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";

import PageLayout from "@/shared/components/layout/PageLayout";
import { ErrorMessage, LoadingSpinner } from "@/shared/components";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import {
  GoogleMapView,
  DayScheduleList,
  AddScheduleSheet,
  AddMemoSheet,
  TripHeader,
} from "./components";
import {
  useGeocoding,
  useScheduleAdd,
  useScheduleMemo,
  useTripSchedules,
} from "./hooks";
import type { Schedule } from "./types";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MAP_ZOOM,
} from "./constants";

function SchedulePageContent() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);

  const [focusedLocation, setFocusedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 일정 추가 관련 로직
  const {
    isSheetOpen,
    selectedDay,
    handleAddSchedule,
    handleCloseSheet,
    handleSelectPlace,
  } = useScheduleAdd(tripId || "");

  // 메모 관련 로직
  const {
    isMemoSheetOpen,
    selectedDay: memoSelectedDay,
    handleAddMemo,
    handleCloseMemoSheet,
    handleSaveMemo,
  } = useScheduleMemo(tripId || "");

  const { coordinates: regionCoordinates } = useGeocoding(
    tripInfo?.regionName,
    tripInfo?.regionId
  );

  const { data: allSchedules } = useTripSchedules(tripId);

  const mapCenter = regionCoordinates || DEFAULT_MAP_CENTER;

  const handleScheduleClick = (schedule: Schedule) => {
    if (schedule.latitude && schedule.longitude) {
      setFocusedLocation({
        lat: schedule.latitude,
        lng: schedule.longitude,
      });
    }
  };

  const scheduleMarkers = useMemo(() => {
    if (!allSchedules || allSchedules.length === 0) return [];

    const markers = allSchedules
      .filter((schedule) => schedule.latitude && schedule.longitude)
      .sort((a, b) => a.visit_order - b.visit_order)
      .map((schedule, index) => ({
        id: schedule.id,
        position: {
          lat: schedule.latitude!,
          lng: schedule.longitude!,
        },
        title: schedule.place_name,
        label: index + 1,
      }));

    return markers;
  }, [allSchedules]);

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

  if (!tripId || !tripInfo) {
    return (
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
  }

  return (
    <PageLayout>
      <VStack gap={0} align="stretch">
        <Box position="sticky" top="56px" zIndex={10} bg="white" pb={2}>
          <TripHeader tripInfo={tripInfo} />

          <GoogleMapView
            center={focusedLocation || mapCenter}
            zoom={focusedLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM}
            height="300px"
            markers={scheduleMarkers}
          />
        </Box>

        {/* 일정표 */}
        <Box pt={4}>
          <DayScheduleList
            tripId={tripId}
            startDate={tripInfo.startDate}
            endDate={tripInfo.endDate}
            onAddSchedule={handleAddSchedule}
            onAddMemo={handleAddMemo}
            onScheduleClick={handleScheduleClick}
          />
        </Box>
      </VStack>

      {/* 일정 추가 바텀시트 */}
      {selectedDay && (
        <AddScheduleSheet
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onSelectPlace={handleSelectPlace}
          dayNumber={selectedDay.dayNumber}
          date={selectedDay.date}
        />
      )}

      {/* 메모 추가 바텀시트 */}
      {memoSelectedDay && (
        <AddMemoSheet
          isOpen={isMemoSheetOpen}
          onClose={handleCloseMemoSheet}
          onSaveMemo={handleSaveMemo}
          dayNumber={memoSelectedDay.dayNumber}
          date={memoSelectedDay.date}
        />
      )}
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
