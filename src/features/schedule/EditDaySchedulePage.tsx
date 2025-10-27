import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

import { borderColors, componentColors } from "@/shared/constants/colors";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { useSchedulesByDay } from "./hooks/useSchedulesByDay";
import { useUpdateScheduleOrder } from "./services/useUpdateScheduleOrder";
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

  const updateOrderMutation = useUpdateScheduleOrder(tripId, {
    onSuccess: () => {
      setHasChanges(false);
      setSelectedIds(new Set());
      navigate({ to: "/schedule/$tripId", params: { tripId } });
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

    if (confirm(`선택한 ${selectedIds.size}개의 일정을 삭제하시겠습니까?`)) {
      // TODO: 일괄 삭제 API 호출
      const newSchedules = schedules.filter((s) => !selectedIds.has(s.id));
      setSchedules(newSchedules);
      setSelectedIds(new Set());
      setHasChanges(true);
    }
  };

  const handleMoveDate = () => {
    if (selectedIds.size === 0) return;
    // TODO: 날짜 이동 기능 구현
    alert("날짜 이동 기능은 곧 구현됩니다!");
    setSelectedIds(new Set());
  };

  const handleBack = () => {
    if (hasChanges) {
      if (confirm("변경사항이 저장되지 않습니다. 나가시겠습니까?")) {
        navigate({ to: "/schedule/$tripId", params: { tripId } });
      }
    } else {
      navigate({ to: "/schedule/$tripId", params: { tripId } });
    }
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
          onBack={handleBack}
          onSave={handleScheduleSave}
          onMoveDate={handleMoveDate}
          onDelete={handleDeleteSelectedItem}
        />
      </VStack>
    </PageLayout>
  );
}
