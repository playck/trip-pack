import { VStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import { getTripDays, getDayDate } from "@/shared/utiles/date";
import { DayScheduleCard } from "./";
import type { Schedule } from "../types";

interface DayScheduleListProps {
  tripId: string;
  startDate: string;
  endDate: string;
  onAddSchedule?: (dayNumber: number, date: string) => void;
  onAddMemo?: (dayNumber: number, date: string) => void;
  onScheduleClick?: (schedule: Schedule) => void;
}

export default function DayScheduleList({
  tripId,
  startDate,
  endDate,
  onAddSchedule,
  onAddMemo,
  onScheduleClick,
}: DayScheduleListProps) {
  const tripDays = getTripDays(startDate, endDate);

  if (tripDays <= 0) return null;

  return (
    <VStack align="stretch" gap={4}>
      <Text fontSize="lg" fontWeight="bold">
        여행 일정
      </Text>
      {Array.from({ length: tripDays }, (_, index) => {
        const dayNumber = index + 1;
        const date = getDayDate(startDate, dayNumber);
        const formattedDate = dayjs(date).locale("ko").format("M월 D일 (ddd)");

        return (
          <DayScheduleCard
            key={date}
            tripId={tripId}
            dayNumber={dayNumber}
            date={date}
            formattedDate={formattedDate}
            onAddSchedule={() => onAddSchedule?.(dayNumber, date)}
            onAddMemo={() => onAddMemo?.(dayNumber, date)}
            onScheduleClick={(schedule) => {
              onScheduleClick?.(schedule);
            }}
          />
        );
      })}
    </VStack>
  );
}
