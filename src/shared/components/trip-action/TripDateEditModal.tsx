import { useState, useEffect } from "react";
import { Box, Text, VStack, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { ConfirmDialog } from "@/shared/components";
import Calendar from "@/shared/components/Calendar";
import {
  useUpdateTripDates,
  useOutOfRangeCounts,
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

  // 범위 밖 일정·경비 개수 조회 (기간이 단축된 경우에만)
  const {
    data: outOfRange,
    isFetching: isCountFetching,
    isError: isCountError,
  } = useOutOfRangeCounts(tripId, newDuration, isDurationShortened && isOpen);

  // 개수를 모르면(조회 실패) 지워질 수 있다고 보고 경고한다
  const needsDeleteWarning =
    isDurationShortened &&
    (isCountError ||
      (outOfRange?.schedules ?? 0) + (outOfRange?.expenses ?? 0) > 0);

  const deleteTargets = !outOfRange
    ? "일정과 경비가"
    : outOfRange.schedules > 0 && outOfRange.expenses > 0
      ? `일정 ${outOfRange.schedules}개와 경비 ${outOfRange.expenses}건이`
      : outOfRange.schedules > 0
        ? `일정 ${outOfRange.schedules}개가`
        : `경비 ${outOfRange.expenses}건이`;

  const handleSave = () => {
    if (!dates.startDate || !dates.endDate) return;

    // 기간 단축으로 지워질 일정·경비가 있으면 경고 다이얼로그 표시
    if (needsDeleteWarning) {
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
        confirmDisabled={
          !isValidDate || (isDurationShortened && isCountFetching)
        }
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
        title="일정·경비 삭제 확인"
        message={`여행 기간을 줄이면 ${newDuration + 1}일차부터의 ${deleteTargets} 삭제되며 되돌릴 수 없습니다. 계속하시겠습니까?`}
        confirmLabel="삭제하고 저장"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        isLoading={updateTripDatesMutation.isPending}
        isDangerous
      />
    </>
  );
}
