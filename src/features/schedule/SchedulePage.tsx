import { useState, useMemo } from "react";
import { VStack, Box, HStack, IconButton } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Share2 } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { TripActionMenu } from "@/shared/components";
import {
  GoogleMapView,
  DayScheduleList,
  AddScheduleSheet,
  AddMemoSheet,
  ApiKeyMissingState,
  MapWrapper,
} from "./components";
import {
  useGeocoding,
  useScheduleAdd,
  useScheduleMemo,
  useTripSchedules,
  useShareSchedule,
} from "./hooks";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MAP_ZOOM,
} from "./constants";
import { isMemo } from "./utils/scheduleHelpers";
import { ScheduleProvider } from "./context";
import type { Schedule } from "./types";

function SchedulePageContent() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo } = useTripInfo(tripId);

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

  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

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

  if (!tripInfo) return null;

  const headerRightAction = (
    <HStack gap={0}>
      <IconButton
        aria-label="일정 공유하기"
        variant="ghost"
        size="sm"
        onClick={handleShareSchedule}
        color="gray.600"
      >
        <Share2 size={20} />
      </IconButton>
      <TripActionMenu tripId={tripId} tripTitle={tripInfo.title || "여행"} />
    </HStack>
  );

  return (
    <PageLayout>
      <ScheduleProvider
        value={{
          onEditMemo: handleEditMemo,
          onScheduleClick: handleScheduleClick,
        }}
      >
        <VStack gap={0} align="stretch">
          {!isMapFullScreen && (
            <TripInfoHeader
              title={
                tripInfo.title || `${tripInfo.regionName || "여행"} 여행지`
              }
              subTitle={formatTripDateRange(
                tripInfo.startDate,
                tripInfo.endDate
              )}
              rightAction={headerRightAction}
            />
          )}

          <MapWrapper isFullScreen={isMapFullScreen}>
            <GoogleMapView
              center={focusedLocation || mapCenter}
              zoom={mapZoom}
              height="200px"
              markers={scheduleMarkers}
              onFullScreenChange={setIsMapFullScreen}
            />
          </MapWrapper>

          {/* 일정표 */}
          <Box pt={3} pb="300px" display={isMapFullScreen ? "none" : "block"}>
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
