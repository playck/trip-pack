import { Text, Timeline, IconButton, Badge, HStack } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import { isMemo } from "../../utils/scheduleHelpers";
import { getMemoIcon, getPlaceIcon } from "../../memoIcons";
import { useScheduleContext } from "../../context";

interface ScheduleItemProps {
  schedule: Schedule;
}

export default function ScheduleItem({ schedule }: ScheduleItemProps) {
  const { onScheduleClick, onOpenActionSheet, scheduleExpenses } =
    useScheduleContext();
  const expenseAmount = scheduleExpenses?.[schedule.id];
  const isExpenseContent = expenseAmount !== undefined && expenseAmount > 0;
  const isScheduleMemo = isMemo(schedule);
  const ItemIcon = isScheduleMemo
    ? getMemoIcon(schedule.category)
    : getPlaceIcon(schedule.category);

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
        <Timeline.Indicator bg="white">
          <ItemIcon size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content width="full" ml={-2} pb="16px">
        <div
          onClick={handleClick}
          style={{
            cursor: onScheduleClick ? "pointer" : "default",
            paddingRight: !isScheduleMemo && onOpenActionSheet ? "32px" : "0",
          }}
        >
          <HStack justify="space-between" align="center" gap={2}>
            <Timeline.Title
              className="selectable"
              fontSize="md"
              fontWeight="semibold"
              mb="4px"
            >
              {schedule.place_name}
              {isExpenseContent && (
                <Badge
                  colorPalette="gray"
                  variant="surface"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  ₩{expenseAmount.toLocaleString()}
                </Badge>
              )}
            </Timeline.Title>
            {!isScheduleMemo && onOpenActionSheet && (
              <IconButton
                aria-label="일정 관리"
                variant="ghost"
                size="xs"
                color="gray.400"
                position="absolute"
                right={0}
                top={0}
                transform="translateY(-6px)"
                onClick={handleOpenAction}
              >
                <MoreVertical size={16} />
              </IconButton>
            )}
          </HStack>

          {!isScheduleMemo && schedule.start_time && (
            <Timeline.Description fontSize="sm" color={textColors.tertiary}>
              <Text as="span" mr={2}>
                {schedule.start_time.slice(0, 5)}
              </Text>
            </Timeline.Description>
          )}

          {!isScheduleMemo && schedule.notes && (
            <Text
              className="selectable"
              fontSize="sm"
              color={textColors.subtle}
              mt={1}
            >
              {schedule.notes}
            </Text>
          )}
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
