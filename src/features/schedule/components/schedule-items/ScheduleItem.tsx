import { Text, Timeline, IconButton } from "@chakra-ui/react";
import { MapPin, StickyNote, MoreVertical } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import { isMemo } from "../../utils/scheduleHelpers";
import { useScheduleContext } from "../../context";

interface ScheduleItemProps {
  schedule: Schedule;
}

export default function ScheduleItem({ schedule }: ScheduleItemProps) {
  const isScheduleMemo = isMemo(schedule);

  const { onScheduleClick, onOpenActionSheet } = useScheduleContext();

  const handleClick = () => {
    onScheduleClick?.(schedule);
  };

  const handleOpenAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenActionSheet?.(schedule);
  };

  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator>
          {isScheduleMemo ? <StickyNote size={14} /> : <MapPin size={14} />}
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content width="full" ml={-2}>
        <div
          onClick={handleClick}
          style={{
            cursor: onScheduleClick ? "pointer" : "default",
            paddingRight: !isScheduleMemo && onOpenActionSheet ? "32px" : "0",
          }}
        >
          <Timeline.Title fontSize="md" fontWeight="semibold" mb="4px">
            {schedule.place_name}
          </Timeline.Title>
          {!isScheduleMemo && (
            <Timeline.Description fontSize="sm" color={textColors.tertiary}>
              {schedule.start_time && (
                <Text as="span" mr={2}>
                  {schedule.start_time.slice(0, 5)}
                </Text>
              )}
              {schedule.place_address && (
                <Text as="span">{schedule.place_address}</Text>
              )}
            </Timeline.Description>
          )}

          {!isScheduleMemo && schedule.notes && (
            <Text fontSize="sm" color={textColors.subtle} mt={1}>
              {schedule.notes}
            </Text>
          )}
        </div>

        {!isScheduleMemo && onOpenActionSheet && (
          <IconButton
            aria-label="일정 관리"
            variant="ghost"
            size="xs"
            color="gray.400"
            position="absolute"
            right={0}
            top={0}
            onClick={handleOpenAction}
          >
            <MoreVertical size={16} />
          </IconButton>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
}
