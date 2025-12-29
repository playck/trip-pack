import { Box, Text, Timeline } from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { colors, borderColors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import { isMemo } from "../../utils/scheduleHelpers";
import { EditableScheduleItem, EditableMemoItem } from "../schedule-items";

interface EditableScheduleListProps {
  schedules: Schedule[];
  selectedIds?: Set<string>;
  onReorder: (schedules: Schedule[]) => void;
  onToggleSelect: (scheduleId: string) => void;
}

export default function EditableScheduleList({
  schedules,
  selectedIds = new Set(),
  onReorder,
  onToggleSelect,
}: EditableScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <Box
        p={8}
        borderRadius="md"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={borderColors.emphasized}
        textAlign="center"
      >
        <Text fontSize="sm" color={colors.neutral.solid}>
          일정이 없습니다
        </Text>
      </Box>
    );
  }

  return (
    <Timeline.Root size="sm" variant="subtle">
      <Reorder.Group
        axis="y"
        values={schedules}
        onReorder={onReorder}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {schedules.map((schedule) => {
          const isScheduleMemo = isMemo(schedule);
          const isSelected = selectedIds.has(schedule.id);

          return (
            <Reorder.Item
              key={schedule.id}
              value={schedule}
              style={{ position: "relative" }}
            >
              {isScheduleMemo ? (
                <EditableMemoItem
                  memo={schedule}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect(schedule.id)}
                />
              ) : (
                <EditableScheduleItem
                  schedule={schedule}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect(schedule.id)}
                />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </Timeline.Root>
  );
}
