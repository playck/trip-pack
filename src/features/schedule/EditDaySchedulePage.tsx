import { useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

import { borderColors, componentColors } from "@/shared/constants/colors";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import {
  useSchedulesByDay,
  useScheduleSelection,
  useScheduleReorder,
  useScheduleActions,
  useDialogState,
} from "./hooks";
import {
  EditableScheduleList,
  ScheduleActionButtons,
  MoveDateBottomSheet,
} from "./components";

export default function ManageDaySchedulePage() {
  const { tripId, dayNumber } = useParams({
    from: "/schedule/edit/$tripId/$dayNumber",
  });
  const navigate = useNavigate();

  const { data: tripInfo } = useTripInfo(tripId);
  const { schedules: originalSchedules, isLoading } = useSchedulesByDay(
    tripId,
    parseInt(dayNumber)
  );

  const { selectedIds, handleToggleSelect, clearSelection, selectionCount } =
    useScheduleSelection();

  const { schedules, hasChanges, handleReorder, handleSave, isSaving } =
    useScheduleReorder(tripId, originalSchedules, clearSelection);

  const { handleDelete, handleMove, isDeleting, isMoving } = useScheduleActions(
    tripId,
    () => {
      clearSelection();
      closeDialog();
    }
  );

  const {
    openDialog,
    openBackDialog,
    openDeleteDialog,
    openMoveDateSheet,
    closeDialog,
  } = useDialogState();

  // 페이지 마운트 시 스크롤 최상단으로 리셋
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteClick = () => {
    if (selectionCount === 0) return;
    openDeleteDialog();
  };

  const handleConfirmDelete = () => {
    const deleteIds = Array.from(selectedIds);
    handleDelete(deleteIds);
  };

  const handleMoveDateClick = () => {
    if (selectionCount === 0) return;
    openMoveDateSheet();
  };

  const handleConfirmMoveDate = (targetDayNumber: number) => {
    const scheduleIds = Array.from(selectedIds);
    handleMove(scheduleIds, targetDayNumber);
  };

  const handleBack = () => {
    if (hasChanges) {
      openBackDialog();
    } else {
      navigate({ to: "/schedule/$tripId", params: { tripId } });
    }
  };

  const handleConfirmBack = () => {
    closeDialog();
    navigate({ to: "/schedule/$tripId", params: { tripId } });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <VStack py={20}>
          <LoadingSpinner />
          <Text>일정을 불러오는 중...</Text>
        </VStack>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <VStack gap={0} align="stretch" h="100vh">
        {/* 헤더 */}
        <Box
          borderBottomWidth="1px"
          borderColor={borderColors.default}
          bg="white"
          position="sticky"
          top={`${HEADER_HEIGHT}px`}
          zIndex={10}
        >
          <HStack py={3} gap={2} align="center">
            <Box onClick={handleBack} cursor="pointer" p={1}>
              <ChevronLeft size={24} />
            </Box>

            <VStack gap={0} flex={1} align="start">
              <Text fontSize="lg" fontWeight="bold">
                {dayNumber}일차 일정 수정
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* 일정 리스트 */}
        <Box
          flex={1}
          py={4}
          pb={8}
          overflowY="auto"
          bg={componentColors.card.background}
        >
          <EditableScheduleList
            schedules={schedules}
            selectedIds={selectedIds}
            onReorder={handleReorder}
            onToggleSelect={handleToggleSelect}
          />
        </Box>

        <ScheduleActionButtons
          selectedCount={selectionCount}
          hasChanges={hasChanges}
          isPending={isSaving}
          isDeleting={isDeleting}
          onBack={handleBack}
          onSave={handleSave}
          onMoveDate={handleMoveDateClick}
          onDelete={handleDeleteClick}
        />
      </VStack>

      {/* 뒤로가기 확인 Alert */}
      <ConfirmDialog
        isOpen={openDialog === "back"}
        onClose={closeDialog}
        title="변경사항 저장 안 됨"
        message="변경사항이 저장되지 않습니다. 나가시겠습니까?"
        confirmLabel="나가기"
        cancelLabel="취소"
        onConfirm={handleConfirmBack}
        isDangerous={false}
      />

      {/* 삭제 확인 Alert */}
      <ConfirmDialog
        isOpen={openDialog === "delete"}
        onClose={closeDialog}
        title="일정 삭제"
        message={
          <Text>
            선택한 {selectionCount}개의 일정을 삭제하시겠습니까?
            <br />
            <Text as="span" color="red.600" fontWeight="medium">
              삭제된 일정은 복구할 수 없습니다.
            </Text>
          </Text>
        }
        confirmLabel="삭제하기"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        isDangerous={true}
      />

      {/* 날짜 이동 BottomSheet */}
      {tripInfo && (
        <MoveDateBottomSheet
          isOpen={openDialog === "moveDate"}
          onClose={closeDialog}
          currentDayNumber={parseInt(dayNumber)}
          tripStartDate={tripInfo.startDate}
          tripEndDate={tripInfo.endDate || tripInfo.startDate}
          onSelectDay={handleConfirmMoveDate}
          isLoading={isMoving}
        />
      )}
    </PageLayout>
  );
}
