import { HStack, Text, Box, IconButton, Timeline } from "@chakra-ui/react";
import { Plus, StickyNote, Edit } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  colors,
  componentColors,
  borderColors,
  textColors,
} from "@/shared/constants/colors";
import { useSchedulesByDay } from "../hooks/useSchedulesByDay";
import { SwipeableScheduleItem } from "./";
import type { Schedule } from "../types";
import { DAY_CARD_STICKY_TOP } from "../constants";

interface DayScheduleCardProps {
  tripId: string;
  dayNumber: number;
  date: string;
  formattedDate: string;
  onAddSchedule?: () => void;
  onAddMemo?: () => void;
}

export default function DayScheduleCard({
  tripId,
  dayNumber,
  formattedDate,
  onAddSchedule,
  onAddMemo,
}: DayScheduleCardProps) {
  const navigate = useNavigate();
  const { schedules, isLoading } = useSchedulesByDay(tripId, dayNumber);

  const goToEditDayPage = () => {
    navigate({
      to: "/schedule/edit/$tripId/$dayNumber",
      params: { tripId, dayNumber: dayNumber.toString() },
    });
  };

  const renderTimelineContent = () => {
    if (isLoading) return <TimelineLoading />;
    if (schedules.length === 0)
      return <TimelineEmpty onAddSchedule={onAddSchedule} />;
    return <TimelineContent schedules={schedules} tripId={tripId} />;
  };

  return (
    <Box
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColors.default}
      bg={componentColors.card.background}
    >
      {/* 헤더 */}
      <HStack
        px={3}
        py={2}
        bg={colors.primary.subtle}
        borderBottomWidth="1px"
        borderTopRadius="lg"
        borderColor={borderColors.default}
        justify="space-between"
        align="center"
        position="sticky"
        top={`${DAY_CARD_STICKY_TOP}px`}
        zIndex={5}
      >
        <HStack gap={2}>
          <Text fontSize="lg" fontWeight="bold" color={colors.primary.fg}>
            {dayNumber}일차
          </Text>
          <Text fontSize="sm" color={textColors.tertiary}>
            {formattedDate}
          </Text>
        </HStack>

        <HStack gap={2}>
          <IconButton
            size="sm"
            variant="solid"
            aria-label="일정 추가"
            onClick={onAddSchedule}
            colorPalette={colors.primary.palette}
          >
            <Plus size={18} />
          </IconButton>
          <IconButton
            size="sm"
            variant="outline"
            aria-label="메모 추가"
            onClick={onAddMemo}
            colorPalette={colors.neutral.palette}
            borderColor={borderColors.emphasized}
          >
            <StickyNote size={18} />
          </IconButton>
          <IconButton
            size="sm"
            variant="outline"
            aria-label="일정 관리"
            onClick={goToEditDayPage}
            colorPalette={colors.neutral.palette}
            borderColor={borderColors.emphasized}
          >
            <Edit size={18} />
          </IconButton>
        </HStack>
      </HStack>

      <Box p={3} minH="100px" borderBottomRadius="lg">
        {renderTimelineContent()}
      </Box>
    </Box>
  );
}

const TimelineLoading = () => (
  <Box p={6} textAlign="center">
    <Text fontSize="sm" color={textColors.subtle}>
      일정을 불러오고 있어요...
    </Text>
  </Box>
);

const TimelineEmpty = ({ onAddSchedule }: { onAddSchedule?: () => void }) => (
  <Box
    p={6}
    borderRadius="md"
    borderWidth="2px"
    borderStyle="dashed"
    borderColor={borderColors.emphasized}
    textAlign="center"
    cursor="pointer"
    onClick={onAddSchedule}
  >
    <Text fontSize="sm" color={textColors.subtle}>
      일정을 추가해주세요
    </Text>
  </Box>
);

const TimelineContent = ({
  schedules,
  tripId,
}: {
  schedules: Schedule[];
  tripId: string;
}) => {
  return (
    <Timeline.Root size="sm" variant="subtle">
      {schedules.map((schedule) => (
        <SwipeableScheduleItem
          key={schedule.id}
          schedule={schedule}
          tripId={tripId}
        />
      ))}
    </Timeline.Root>
  );
};
