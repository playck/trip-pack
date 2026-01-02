import { useState, useMemo } from "react";
import {
  VStack,
  Box,
  HStack,
  IconButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Share2 } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { TripActionMenu, ConfirmDialog } from "@/shared/components";
import AddExpenseSheet from "@/features/expense/components/AddExpenseSheet";
import { useCreateExpense } from "@/features/expense/services/useCreateExpense";
import { useDeleteSchedule } from "./services/useDeleteSchedule";
import { useUpdateSchedule } from "./services/useUpdateSchedule";
import {
  GoogleMapView,
  DayScheduleList,
  AddScheduleSheet,
  AddMemoSheet,
  ApiKeyMissingState,
  MapWrapper,
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
  const countryCode = useMemo(() => {
    return parseRegionId(tripInfo?.regionId)?.countryCode;
  }, [tripInfo?.regionId]);

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

  // 경비 추가 관련 로직
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);
  const [selectedScheduleForExpense, setSelectedScheduleForExpense] =
    useState<Schedule | null>(null);

  const createExpenseMutation = useCreateExpense(tripId || "");

  // 일정 액션 시트 및 수정 관련 로직
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedScheduleForAction, setSelectedScheduleForAction] =
    useState<Schedule | null>(null);

  const {
    open: isDeleteConfirmOpen,
    onOpen: openDeleteConfirm,
    onClose: closeDeleteConfirm,
  } = useDisclosure();

  const deleteScheduleMutation = useDeleteSchedule(tripId || "", {
    onSuccess: () => {
      closeDeleteConfirm();
      setSelectedScheduleForAction(null);
    },
  });
  const updateScheduleMutation = useUpdateSchedule(tripId || "");

  const handleOpenActionSheet = (schedule: Schedule) => {
    setSelectedScheduleForAction(schedule);
    setIsActionSheetOpen(true);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
    // 액션 시트가 닫힐 때 선택된 일정을 바로 초기화하지 않음 (수정/경비추가 등으로 이어질 수 있음)
    // 각 후속 액션에서 필요 없으면 초기화하거나, 후속 액션 종료 시 초기화
  };

  const handleEditSchedule = () => {
    // 액션 시트는 닫고 수정 시트는 염
    // selectedScheduleForAction 상태는 유지
    setIsEditSheetOpen(true);
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
    setSelectedScheduleForAction(null);
  };

  const handleSaveEditSchedule = (
    scheduleId: string,
    updates: { placeName: string; notes?: string }
  ) => {
    updateScheduleMutation.mutate({
      scheduleId,
      ...updates,
    });
  };

  const handleDeleteSchedule = () => {
    if (selectedScheduleForAction) {
      openDeleteConfirm();
    }
  };

  const handleConfirmDelete = () => {
    if (selectedScheduleForAction) {
      deleteScheduleMutation.mutate(selectedScheduleForAction.id);
    }
  };

  const handleOpenExpenseSheet = () => {
    if (selectedScheduleForAction) {
      setSelectedScheduleForExpense(selectedScheduleForAction);
      setIsExpenseSheetOpen(true);
    }
  };

  const handleCloseExpenseSheet = () => {
    setIsExpenseSheetOpen(false);
    setSelectedScheduleForExpense(null);
  };

  const handleSaveExpense = (
    name: string,
    amount: number,
    scheduleId?: string
  ) => {
    if (!tripId || !selectedScheduleForExpense) return;

    createExpenseMutation.mutate({
      tripId,
      expenseDate: selectedScheduleForExpense.schedule_date,
      dayNumber: selectedScheduleForExpense.day_number,
      category: name, // 현재는 category 필드를 항목명으로 사용
      amount,
      scheduleId,
    });
  };

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
          onOpenActionSheet: handleOpenActionSheet,
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
      {selectedScheduleForAction && (
        <>
          <ScheduleActionSheet
            isOpen={isActionSheetOpen}
            onClose={handleCloseActionSheet}
            scheduleName={selectedScheduleForAction.place_name}
            onEdit={handleEditSchedule}
            onAddExpense={handleOpenExpenseSheet}
            onDelete={handleDeleteSchedule}
          />

          <EditScheduleSheet
            isOpen={isEditSheetOpen}
            onClose={handleCloseEditSheet}
            schedule={selectedScheduleForAction}
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
        isLoading={deleteScheduleMutation.isPending}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{selectedScheduleForAction?.place_name}"
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
