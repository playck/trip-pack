import { useState, useEffect } from "react";
import { Box, Text, VStack, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { ConfirmDialog } from "@/shared/components";
import Calendar from "@/shared/components/Calendar";
import { useUpdateTripDates } from "@/shared/service/trip/useUpdateTripDates";

interface TravelDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface TripDateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentStartDate: string;
  currentEndDate: string;
}

export function TripDateEditModal({
  isOpen,
  onClose,
  tripId,
  currentStartDate,
  currentEndDate,
}: TripDateEditModalProps) {
  const [dates, setDates] = useState<TravelDates>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (isOpen) {
      setDates({
        startDate: currentStartDate ? new Date(currentStartDate) : null,
        endDate: currentEndDate ? new Date(currentEndDate) : null,
      });
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const updateTripDatesMutation = useUpdateTripDates(tripId, {
    onSuccess: () => {
      onClose();
    },
  });

  const handleSave = () => {
    if (dates.startDate && dates.endDate) {
      updateTripDatesMutation.mutate({
        startDate: dayjs(dates.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(dates.endDate).format("YYYY-MM-DD"),
      });
    }
  };

  const handleDateChange = (newDates: TravelDates) => {
    setDates(newDates);
  };

  const isValidDate = dates.startDate && dates.endDate;

  const isTripStarted = currentStartDate
    ? !dayjs().startOf("day").isBefore(dayjs(currentStartDate).startOf("day"))
    : false;

  return (
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
              <Flex justify="center" align="center" direction="column" gap={1}>
                <Flex align="center">
                  <Text as="span" fontSize="sm">
                    {dayjs(dates.startDate).format("YYYY.MM.DD")} ~{" "}
                    {dayjs(dates.endDate).format("YYYY.MM.DD")}
                  </Text>
                  <Text as="span" ml={2} fontSize="sm">
                    (
                    {dayjs(dates.endDate).diff(dayjs(dates.startDate), "day") +
                      1}
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
  );
}
