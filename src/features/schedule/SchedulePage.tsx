import { useMemo } from "react";
import {
  VStack,
  Box,
  HStack,
  IconButton,
  Text,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Share2, Settings } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { ConfirmDialog, ScrollToTopButton } from "@/shared/components";
import { useScrollToTop } from "@/shared/hooks";
import { TripSettingsPanel } from "@/features/trip-settings";
import AddExpenseSheet from "@/features/expense/components/AddExpenseSheet";
import { useTripExpenses } from "@/features/expense/services/useTripExpenses";
import {
  GoogleMapView,
  DayScheduleList,
  AddScheduleSheet,
  AddMemoSheet,
  ApiKeyMissingState,
  MapWrapper,
  MapCollapseButton,
} from "./components";
import ScheduleActionSheet from "./components/modals/ScheduleActionSheet";
import EditScheduleSheet from "./components/modals/EditScheduleSheet";
import {
  useGeocoding,
  parseRegionId,
  useScheduleAdd,
  useScheduleMemo,
  useTripSchedules,
  useShareSchedule,
} from "./hooks";
import { useScheduleDetailActions } from "./hooks/useScheduleDetailActions";
import { useScheduleMap } from "./hooks/useScheduleMap";
import { useHidePastSchedule } from "./hooks/useHidePastSchedule";
import { ScheduleProvider } from "./context";

function SchedulePageContent() {
  const { tripId } = useParams({ from: "/schedule/$tripId" });
  const { data: tripInfo } = useTripInfo(tripId);
  const settingsDrawer = useDisclosure();
  const { data: expenses } = useTripExpenses(tripId);
  const { data: allSchedules } = useTripSchedules(tripId);

  const scheduleExpenseMap = useMemo(() => {
    if (!expenses) return {};
    return expenses.reduce(
      (acc, expense) => {
        if (expense.schedule_id) {
          acc[expense.schedule_id] =
            (acc[expense.schedule_id] || 0) + expense.amount;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  }, [expenses]);

  const countryCode = useMemo(() => {
    return parseRegionId(tripInfo?.regionId)?.countryCode;
  }, [tripInfo?.regionId]);

  // 일정 추가
  const {
    isSheetOpen,
    selectedDay,
    handleAddSchedule,
    handleCloseSheet,
    handleSelectPlace,
  } = useScheduleAdd(tripId || "");

  // 메모
  const {
    isMemoSheetOpen,
    selectedDay: memoSelectedDay,
    editingMemo,
    handleAddMemo,
    handleEditMemo,
    handleCloseMemoSheet,
    handleSaveMemo,
  } = useScheduleMemo(tripId || "");

  // 액션 시트 + 수정 + 삭제 + 경비
  const {
    isActionSheetOpen,
    selectedSchedule,
    handleOpenActionSheet,
    handleCloseActionSheet,
    isEditSheetOpen,
    handleEditSchedule,
    handleCloseEditSheet,
    handleSaveEditSchedule,
    isDeleteConfirmOpen,
    closeDeleteConfirm,
    handleDeleteSchedule,
    handleConfirmDelete,
    isDeleting,
    isExpenseSheetOpen,
    selectedScheduleForExpense,
    handleOpenExpenseSheet,
    handleCloseExpenseSheet,
    handleSaveExpense,
  } = useScheduleDetailActions(tripId || "", handleEditMemo);

  // 지도
  const {
    coordinates: regionCoordinates,
    error: geocodingError,
  } = useGeocoding(tripInfo?.regionName, tripInfo?.regionId);

  const isMapReady =
    !tripInfo?.regionId ||
    regionCoordinates !== null ||
    geocodingError !== null;

  const {
    isMapFullScreen,
    isMapCollapsed,
    mapCenter,
    mapZoom,
    scheduleMarkers,
    routesByDay,
    availableDays,
    selectedDay: selectedMapDay,
    setSelectedDay: setSelectedMapDay,
    dayColorMap,
    setIsMapFullScreen,
    handleScheduleClick,
    handleToggleCollapse,
  } = useScheduleMap(allSchedules, regionCoordinates);

  const { showScrollTop, scrollToTop } = useScrollToTop();

  // 지난 일정 숨기기
  const {
    hidePast,
    toggleHidePast,
    todayDayNumber,
    showToggle: showHidePastToggle,
  } = useHidePastSchedule(tripId, tripInfo?.startDate, tripInfo?.endDate);

  // 공유
  const { handleScheduleShare } = useShareSchedule();

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
      <IconButton
        aria-label="여행 설정"
        variant="ghost"
        size="sm"
        onClick={settingsDrawer.onOpen}
        color="gray.600"
      >
        <Settings size={20} />
      </IconButton>
    </HStack>
  );

  return (
    <PageLayout>
      <ScheduleProvider
        value={{
          onEditMemo: handleEditMemo,
          onScheduleClick: handleScheduleClick,
          onOpenActionSheet: handleOpenActionSheet,
          scheduleExpenses: scheduleExpenseMap,
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
            <Box
              transition="height 0.3s ease-in-out"
              height={isMapCollapsed ? "0px" : "200px"}
              overflow="hidden"
              position="relative"
              zIndex={1}
            >
              {isMapReady ? (
                <GoogleMapView
                  center={mapCenter}
                  zoom={mapZoom}
                  height="200px"
                  markers={scheduleMarkers}
                  routes={routesByDay}
                  dayFilter={{
                    availableDays,
                    selectedDay: selectedMapDay,
                    dayColorMap,
                    onSelectDay: setSelectedMapDay,
                  }}
                  onFullScreenChange={setIsMapFullScreen}
                />
              ) : (
                <Skeleton w="full" h="200px" borderRadius="lg" />
              )}
            </Box>
            {!isMapFullScreen && (
              <MapCollapseButton
                isCollapsed={isMapCollapsed}
                onToggle={handleToggleCollapse}
                hidePast={hidePast}
                onToggleHidePast={
                  showHidePastToggle ? toggleHidePast : undefined
                }
              />
            )}
          </MapWrapper>

          {/* 일정표 */}
          <Box mt={3} pb="300px" display={isMapFullScreen ? "none" : "block"}>
            <DayScheduleList
              tripId={tripId}
              startDate={tripInfo.startDate}
              endDate={tripInfo.endDate}
              isMapCollapsed={isMapCollapsed}
              regionName={tripInfo.regionName ?? undefined}
              hidePastDayNumber={
                showHidePastToggle && hidePast ? todayDayNumber : undefined
              }
              onAddSchedule={handleAddSchedule}
              onAddMemo={handleAddMemo}
            />
          </Box>
        </VStack>
      </ScheduleProvider>

      {/* 맨 위로 스크롤 버튼 */}
      {showScrollTop && (
        <ScrollToTopButton onClick={scrollToTop} floating />
      )}

      {/* 일정 추가 바텀시트 */}
      {selectedDay && (
        <AddScheduleSheet
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onSelectPlace={handleSelectPlace}
          dayNumber={selectedDay.dayNumber}
          date={selectedDay.date}
          countryCode={countryCode}
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

      {/* 일정 액션 시트 */}
      {selectedSchedule && (
        <>
          <ScheduleActionSheet
            isOpen={isActionSheetOpen}
            onClose={handleCloseActionSheet}
            scheduleName={selectedSchedule.place_name}
            scheduleAddress={selectedSchedule.place_address ?? undefined}
            onEdit={handleEditSchedule}
            onAddExpense={handleOpenExpenseSheet}
            onDelete={handleDeleteSchedule}
          />

          <EditScheduleSheet
            isOpen={isEditSheetOpen}
            onClose={handleCloseEditSheet}
            schedule={selectedSchedule}
            onSave={handleSaveEditSchedule}
          />
        </>
      )}

      {/* 일정 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        title="일정 삭제"
        confirmLabel="삭제"
        isDangerous
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{selectedSchedule?.place_name}"
          </Text>
          <br />
          일정을 정말로 삭제하시겠습니까?
        </Text>
      </ConfirmDialog>

      {/* 경비 추가 바텀시트 */}
      {selectedScheduleForExpense && (
        <AddExpenseSheet
          isOpen={isExpenseSheetOpen}
          onClose={handleCloseExpenseSheet}
          onSaveExpense={handleSaveExpense}
          scheduleName={selectedScheduleForExpense.place_name}
          scheduleId={selectedScheduleForExpense.id}
          date={selectedScheduleForExpense.schedule_date}
          tripId={tripId || ""}
        />
      )}

      <TripSettingsPanel
        isOpen={settingsDrawer.open}
        onClose={settingsDrawer.onClose}
        tripId={tripId}
      />
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
