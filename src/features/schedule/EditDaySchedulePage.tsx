import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

import { borderColors, componentColors } from "@/shared/constants/colors";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useSchedulesByDay } from "./hooks/useSchedulesByDay";
import { useUpdateScheduleOrder } from "./services/useUpdateScheduleOrder";
import { useBulkDeleteSchedules } from "./services/useBulkDeleteSchedules";
import { EditableScheduleList, ScheduleActionButtons } from "./components";
import type { Schedule } from "./types";

export default function ManageDaySchedulePage() {
  const { tripId, dayNumber } = useParams({
    from: "/schedule/edit/$tripId/$dayNumber",
  });
  const navigate = useNavigate();

  //   const { data: tripInfo } = useTripInfo(tripId);
  const { schedules: originalSchedules, isLoading } = useSchedulesByDay(
    tripId,
    parseInt(dayNumber)
  );

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const updateOrderMutation = useUpdateScheduleOrder(tripId, {
    onSuccess: () => {
      setHasChanges(false);
      setSelectedIds(new Set());
      navigate({ to: "/schedule/$tripId", params: { tripId } });
    },
  });

  const deleteMutation = useBulkDeleteSchedules(tripId, {
    onSuccess: () => {
      setSelectedIds(new Set());
      setHasChanges(false);
    },
  });

  useEffect(() => {
    if (originalSchedules) {
      setSchedules(originalSchedules);
    }
  }, [originalSchedules]);

  const handleScheduleReorder = (newOrder: Schedule[]) => {
    setSchedules(newOrder);
    setHasChanges(true);
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (scheduleId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scheduleId)) {
        newSet.delete(scheduleId);
      } else {
        newSet.add(scheduleId);
      }

      return newSet;
    });
  };

  const handleDeleteSelectedItem = () => {
    if (selectedIds.size === 0) return;
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const deleteIds = Array.from(selectedIds);
    deleteMutation.mutate(deleteIds);
    setIsDeleteConfirmOpen(false);
  };

  const handleMoveDate = () => {
    if (selectedIds.size === 0) return;
    // TODO: 날짜 이동 기능 구현
    alert("날짜 이동 기능은 곧 구현됩니다!");
    setSelectedIds(new Set());
  };

  const handleBack = () => {
    if (hasChanges) {
      setIsBackConfirmOpen(true);
    } else {
      navigate({ to: "/schedule/$tripId", params: { tripId } });
    }
  };

  const handleConfirmBack = () => {
    setIsBackConfirmOpen(false);
    navigate({ to: "/schedule/$tripId", params: { tripId } });
  };

  const handleScheduleSave = () => {
    const updates = schedules.map((schedule, index) => ({
      id: schedule.id,
      visitOrder: index + 1,
    }));

    updateOrderMutation.mutate({ updates });
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
          top="56px"
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
            onReorder={handleScheduleReorder}
            onToggleSelect={handleToggleSelect}
          />
        </Box>

        <ScheduleActionButtons
          selectedCount={selectedIds.size}
          hasChanges={hasChanges}
          isPending={updateOrderMutation.isPending}
          isDeleting={deleteMutation.isPending}
          onBack={handleBack}
          onSave={handleScheduleSave}
          onMoveDate={handleMoveDate}
          onDelete={handleDeleteSelectedItem}
        />
      </VStack>

      {/* 뒤로가기 확인 Alert */}
      <ConfirmDialog
        isOpen={isBackConfirmOpen}
        onClose={() => setIsBackConfirmOpen(false)}
        title="변경사항 저장 안 됨"
        message="변경사항이 저장되지 않습니다. 나가시겠습니까?"
        confirmLabel="나가기"
        cancelLabel="취소"
        onConfirm={handleConfirmBack}
        isDangerous={false}
      />

      {/* 삭제 확인 Alert */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="일정 삭제"
        message={
          <Text>
            선택한 {selectedIds.size}개의 일정을 삭제하시겠습니까?
            <br />
            <Text as="span" color="red.600" fontWeight="medium">
              삭제된 일정은 복구할 수 없습니다.
            </Text>
          </Text>
        }
        confirmLabel="삭제하기"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        isDangerous={true}
      />
    </PageLayout>
  );
}
