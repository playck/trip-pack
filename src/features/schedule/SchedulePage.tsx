import { useState, useMemo } from "react";
import { VStack, Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";

import PageLayout from "@/shared/components/layout/PageLayout";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import {
  GoogleMapView,
  DayScheduleList,
  AddScheduleSheet,
  AddMemoSheet,
  TripHeader,
} from "./components";
import {
  ScheduleLoadingState,
  ScheduleErrorState,
  ScheduleEmptyState,
  ApiKeyMissingState,
} from "./components/SchedulePageStates";
import {
  useGeocoding,
  useScheduleAdd,
  useScheduleMemo,
  useTripSchedules,
  useShareSchedule,
} from "./hooks";
import type { Schedule } from "./types";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MAP_ZOOM,
} from "./constants";
import { isMemo } from "./utils/scheduleHelpers";
import { ScheduleProvider } from "./context";

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
    editingMemo,
    handleAddMemo,
    handleEditMemo,
    handleCloseMemoSheet,
    handleSaveMemo,
  } = useScheduleMemo(tripId || "");

  const { coordinates: regionCoordinates } = useGeocoding(
    tripInfo?.regionName,
    tripInfo?.regionId
  );

  const { data: allSchedules } = useTripSchedules(tripId);

  const { handleScheduleShare } = useShareSchedule();

  const mapCenter = regionCoordinates || DEFAULT_MAP_CENTER;
  const mapZoom = focusedLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM;

  const scheduleMarkers = useMemo(() => {
    if (!allSchedules || allSchedules.length === 0) return [];

    const isNotMemo = (schedule: Schedule) => !isMemo(schedule);
    const hasLocation = (schedule: Schedule) =>
      schedule.latitude != null && schedule.longitude != null;
    const sortByVisitOrder = (a: Schedule, b: Schedule) =>
      a.visit_order - b.visit_order;
    const createMarker = (schedule: Schedule, index: number) => ({
      id: schedule.id,
      position: {
        lat: schedule.latitude!,
        lng: schedule.longitude!,
      },
      title: schedule.place_name,
      label: index + 1,
    });

    return allSchedules
      .filter(isNotMemo)
      .filter(hasLocation)
      .sort(sortByVisitOrder)
      .map(createMarker);
  }, [allSchedules]);

  const handleScheduleClick = (schedule: Schedule) => {
    if (!schedule.latitude || !schedule.longitude) return;

    setFocusedLocation({
      lat: schedule.latitude!,
      lng: schedule.longitude!,
    });
  };

  const handleShareSchedule = () => {
    handleScheduleShare(allSchedules || [], tripInfo?.title);
  };

  if (isLoading) return <ScheduleLoadingState />;

  if (error) return <ScheduleErrorState error={error} />;

  if (!tripId || !tripInfo) return <ScheduleEmptyState />;

  return (
    <PageLayout>
      <ScheduleProvider
        value={{
          onEditMemo: handleEditMemo,
          onScheduleClick: handleScheduleClick,
        }}
      >
        <VStack gap={0} align="stretch">
          <Box
            position="sticky"
            top={`${HEADER_HEIGHT}px`}
            zIndex={10}
            bg="white"
          >
            <TripHeader
              tripInfo={tripInfo}
              onShareClick={handleShareSchedule}
            />

            <GoogleMapView
              center={focusedLocation || mapCenter}
              zoom={mapZoom}
              height="200px"
              markers={scheduleMarkers}
            />
          </Box>

          {/* 일정표 */}
          <Box pt={3} pb="300px">
            <DayScheduleList
              tripId={tripId}
              startDate={tripInfo.startDate}
              endDate={tripInfo.endDate}
              onAddSchedule={handleAddSchedule}
              onAddMemo={handleAddMemo}
            />
          </Box>
        </VStack>
      </ScheduleProvider>

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

      {/* 메모 바텀시트 */}
      {memoSelectedDay && (
        <AddMemoSheet
          isOpen={isMemoSheetOpen}
          onClose={handleCloseMemoSheet}
          onSaveMemo={handleSaveMemo}
          dayNumber={memoSelectedDay.dayNumber}
          date={memoSelectedDay.date}
          initialMemoText={editingMemo?.memoText}
          isEditMode={!!editingMemo}
        />
      )}
    </PageLayout>
  );
}

export default function SchedulePage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) return <ApiKeyMissingState />;

  return (
    <APIProvider apiKey={apiKey}>
      <SchedulePageContent />
    </APIProvider>
  );
}
