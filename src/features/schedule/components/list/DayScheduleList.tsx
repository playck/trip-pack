import { Box, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import { getTripDays, getDayDate } from "@/shared/utiles/date";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";
import DayScheduleCard from "./DayScheduleCard";

interface DayScheduleListProps {
  tripId: string;
  startDate: string;
  endDate: string;
  isMapCollapsed?: boolean;
  regionName?: string;
  hidePastDayNumber?: number;
  onAddSchedule?: (dayNumber: number, date: string) => void;
  onAddMemo?: (dayNumber: number, date: string) => void;
}

const FIRST_DAY = 1;

export default function DayScheduleList({
  tripId,
  startDate,
  endDate,
  isMapCollapsed = false,
  regionName,
  hidePastDayNumber,
  onAddSchedule,
  onAddMemo,
}: DayScheduleListProps) {
  const tripDays = getTripDays(startDate, endDate);

  const mapHeight = isMapCollapsed ? 0 : 200;
  const mapBottomButtonHeight = 32;
  const curtainHeight = 3.5; // 가림막 높이 근사값
  const dayScheduleCardStickyTop =
    HEADER_HEIGHT +
    TRIP_INFO_HEADER_HEIGHT +
    mapHeight +
    mapBottomButtonHeight +
    curtainHeight;

  if (tripDays <= 0) return null;

  return (
    <VStack align="stretch" gap={3}>
      {Array.from({ length: tripDays }, (_, index) => {
        const dayNumber = index + 1;
        if (hidePastDayNumber && dayNumber < hidePastDayNumber) return null;

        const date = getDayDate(startDate, dayNumber);
        const formattedDate = dayjs(date).locale("ko").format("M월 D일 (ddd)");

        return (
          <Box
            key={date}
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: "auto 300px",
            }}
          >
            <DayScheduleCard
              tripId={tripId}
              dayNumber={dayNumber}
              date={date}
              formattedDate={formattedDate}
              cardStickyTop={dayScheduleCardStickyTop}
              onAddSchedule={() => onAddSchedule?.(dayNumber, date)}
              onAddMemo={() => onAddMemo?.(dayNumber, date)}
              startDate={dayNumber === FIRST_DAY ? startDate : undefined}
              endDate={dayNumber === tripDays ? endDate : undefined}
              tripTotalDays={tripDays}
              isLastDay={dayNumber === tripDays}
              regionName={regionName}
            />
          </Box>
        );
      })}
    </VStack>
  );
}
