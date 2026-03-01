import { useState, useEffect } from "react";
import { Box, Text, VStack, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { ConfirmDialog } from "@/shared/components";
import Calendar from "@/shared/components/Calendar";
import {
  useUpdateTripDates,
  useOutOfRangeScheduleCount,
} from "@/shared/service/trip/useUpdateTripDates";

interface TravelDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface TripDateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle?: string;
  currentStartDate: string;
  currentEndDate: string;
}

export function TripDateEditModal({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  currentStartDate,
  currentEndDate,
}: TripDateEditModalProps) {
  const [dates, setDates] = useState<TravelDates>({
    startDate: null,
    endDate: null,
  });
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDates({
        startDate: currentStartDate ? new Date(currentStartDate) : null,
        endDate: currentEndDate ? new Date(currentEndDate) : null,
      });
      setShowDeleteWarning(false);
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const updateTripDatesMutation = useUpdateTripDates(tripId, {
    tripTitle,
    onSuccess: () => {
      setShowDeleteWarning(false);
      onClose();
    },
  });

  const currentDuration =
    currentStartDate && currentEndDate
      ? dayjs(currentEndDate).diff(dayjs(currentStartDate), "day") + 1
      : 0;

  const newDuration =
    dates.startDate && dates.endDate
      ? dayjs(dates.endDate).diff(dayjs(dates.startDate), "day") + 1
      : 0;

  const isDurationShortened = newDuration < currentDuration && newDuration > 0;

  // 범위 밖 일정 개수 조회 (기간이 단축된 경우에만)
  const { data: outOfRangeCount = 0 } = useOutOfRangeScheduleCount(
    tripId,
    newDuration,
    isDurationShortened && isOpen
  );

  const handleSave = () => {
    if (!dates.startDate || !dates.endDate) return;

    // 기간 단축 + 범위 밖 일정 존재 시 경고 다이얼로그 표시
    if (isDurationShortened && outOfRangeCount > 0) {
      setShowDeleteWarning(true);
      return;
    }

    // 저장 (기간 단축 시 범위 밖 데이터도 같이 삭제)
    updateTripDatesMutation.mutate({
      startDate: dayjs(dates.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(dates.endDate).format("YYYY-MM-DD"),
      deleteOutOfRangeSchedules: isDurationShortened,
    });
  };

  const handleConfirmDelete = () => {
    if (!dates.startDate || !dates.endDate) return;

    // 범위 밖 일정 삭제하고 저장
    updateTripDatesMutation.mutate({
      startDate: dayjs(dates.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(dates.endDate).format("YYYY-MM-DD"),
      deleteOutOfRangeSchedules: true,
    });
  };

  const handleDateChange = (newDates: TravelDates) => {
    setDates(newDates);
  };

  const isValidDate = dates.startDate && dates.endDate;

  const isTripStarted = currentStartDate
    ? !dayjs().startOf("day").isBefore(dayjs(currentStartDate).startOf("day"))
    : false;

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="여행 기간 수정"
        confirmLabel="저장"
        onConfirm={handleSave}
        isLoading={updateTripDatesMutation.isPending}
        confirmDisabled={!isValidDate}
        size="lg"
      >
        <VStack align="stretch" gap={1}>
          <Box>
            <Text fontSize="sm" color="gray.600">
              {dates.startDate && dates.endDate ? (
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  gap={1}
                >
                  <Flex align="center">
                    <Text as="span" fontSize="sm">
                      {dayjs(dates.startDate).format("YYYY.MM.DD")} ~{" "}
                      {dayjs(dates.endDate).format("YYYY.MM.DD")}
                    </Text>
                    <Text as="span" ml={2} fontSize="sm">
                      (
                      {dayjs(dates.endDate).diff(
                        dayjs(dates.startDate),
                        "day"
                      ) + 1}
                      일)
                    </Text>
                  </Flex>
                  {isTripStarted && (
                    <Text fontSize="xs" color="orange.500">
                      ※ 지금은 종료일만 변경 가능합니다
                    </Text>
                  )}
                </Flex>
              ) : (
                <Flex justify="center" align="center">
                  <Text as="p" fontSize="sm">
                    시작일과 종료일을 선택해주세요
                  </Text>
                </Flex>
              )}
            </Text>
          </Box>
          <Box
            css={{
              "& .date__name-wrap": {
                marginBottom: "10px !important",
              },
            }}
          >
            <Calendar
              key={isOpen ? "open" : "closed"}
              startDate={dates.startDate}
              endDate={dates.endDate}
              onChange={handleDateChange}
              minDate={
                isTripStarted && dates.startDate ? dates.startDate : undefined
              }
              isStartDateFixed={isTripStarted}
            />
          </Box>
        </VStack>
      </ConfirmDialog>

      {/* 삭제 경고 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        title="일정 삭제 확인"
        message={`여행 기간을 단축하면 ${outOfRangeCount}개의 일정과 연결된 경비가 삭제됩니다. 계속하시겠습니까?`}
        confirmLabel="삭제하고 저장"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        isLoading={updateTripDatesMutation.isPending}
        isDangerous
      />
    </>
  );
}
