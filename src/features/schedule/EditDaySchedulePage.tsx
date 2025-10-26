import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { VStack, HStack, Text, Box, Button } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

import {
  colors,
  borderColors,
  componentColors,
} from "@/shared/constants/colors";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { useSchedulesByDay } from "./hooks/useSchedulesByDay";
import { useUpdateScheduleOrder } from "./services/useUpdateScheduleOrder";
import EditableScheduleList from "./components/EditableScheduleList";
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

  const updateOrderMutation = useUpdateScheduleOrder(tripId, {
    onSuccess: () => {
      setHasChanges(false);
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
            onReorder={handleScheduleReorder}
          />
        </Box>

        {/* 하단 버튼 영역 */}
        <Box
          py={4}
          borderTopWidth="1px"
          borderColor={borderColors.default}
          bg="white"
          position="sticky"
          bottom={0}
          zIndex={10}
        >
          <HStack gap={3}>
            <Button
              variant="outline"
              size="lg"
              flex={1}
              onClick={handleBack}
              disabled={updateOrderMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="solid"
              size="lg"
              flex={1}
              colorPalette={colors.primary.palette}
              onClick={handleScheduleSave}
              disabled={!hasChanges || updateOrderMutation.isPending}
              loading={updateOrderMutation.isPending}
            >
              저장
            </Button>
          </HStack>
        </Box>
      </VStack>
    </PageLayout>
  );
}
