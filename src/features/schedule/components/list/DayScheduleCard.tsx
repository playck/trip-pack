import { HStack, Text, Box, IconButton, Timeline } from "@chakra-ui/react";
import { Plus, StickyNote, Edit } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  colors,
  componentColors,
  borderColors,
  textColors,
} from "@/shared/constants/colors";
import { useSchedulesByDay } from "../../hooks/useSchedulesByDay";
import ScheduleItem from "../schedule-items/ScheduleItem";
import MemoItem from "../schedule-items/MemoItem";
import { isMemo } from "../../utils/scheduleHelpers";
import type { Schedule } from "../../types";

interface DayScheduleCardProps {
  tripId: string;
  dayNumber: number;
  date: string;
  formattedDate: string;
  cardStickyTop?: number;
  onAddSchedule?: () => void;
  onAddMemo?: () => void;
}

export default function DayScheduleCard({
  tripId,
  dayNumber,
  formattedDate,
  cardStickyTop = 0,
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
      borderWidth="1px"
      borderColor={borderColors.default}
      borderTopRadius="lg"
      bg={componentColors.card.background}
    >
      {/* 헤더 */}
      <HStack
        px={3}
        py={1}
        bg={colors.primary.subtle}
        borderBottomWidth="1px"
        borderTopRadius="lg"
        borderColor={borderColors.default}
        justify="space-between"
        align="center"
        position="sticky"
        top={`${cardStickyTop}px`}
        zIndex={5}
        transition="top 0.3s ease-in-out"
      >
        <HStack gap={1.5} align="baseline">
          <Text fontSize="md" fontWeight="bold" color={colors.primary.fg}>
            {dayNumber}일차
          </Text>
          <Text fontSize="xs" fontWeight="medium" color={textColors.tertiary}>
            {formattedDate}
          </Text>
        </HStack>

        <HStack gap={1}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="일정 추가"
            onClick={onAddSchedule}
            colorPalette={colors.primary.palette}
            _hover={{ bg: "whiteAlpha.500" }}
          >
            <Plus size={14} />
          </IconButton>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="메모 추가"
            onClick={onAddMemo}
            colorPalette={colors.neutral.palette}
            _hover={{ bg: "whiteAlpha.500" }}
          >
            <StickyNote size={14} />
          </IconButton>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="일정 관리"
            onClick={goToEditDayPage}
            colorPalette={colors.neutral.palette}
            _hover={{ bg: "whiteAlpha.500" }}
          >
            <Edit size={14} />
          </IconButton>
        </HStack>
      </HStack>

      <Box p={3} pb={2} minH="80px" borderBottomRadius="lg">
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
}: {
  schedules: Schedule[];
  tripId: string;
}) => {
  return (
    <Timeline.Root size="sm" variant="subtle" gap={1.5}>
      {schedules.map((schedule) =>
        isMemo(schedule) ? (
          <MemoItem key={schedule.id} memo={schedule} />
        ) : (
          <ScheduleItem key={schedule.id} schedule={schedule} />
        )
      )}
    </Timeline.Root>
  );
};
