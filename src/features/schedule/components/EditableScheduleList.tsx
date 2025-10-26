import { Box, Text, Timeline } from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { colors, borderColors } from "@/shared/constants/colors";
import type { Schedule } from "../types";
import { isMemo } from "../utils/scheduleHelpers";
import { EditableScheduleItem, EditableMemoItem } from "./schedule-items";

interface EditableScheduleListProps {
  schedules: Schedule[];
  onReorder: (schedules: Schedule[]) => void;
}

export default function EditableScheduleList({
  schedules,
  onReorder,
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
        <Text fontSize="sm" color={colors.neutral.subtle}>
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
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {schedules.map((schedule) => {
          const isScheduleMemo = isMemo(schedule);
          return (
            <Reorder.Item
              key={schedule.id}
              value={schedule}
              style={{ position: "relative" }}
            >
              {isScheduleMemo ? (
                <EditableMemoItem memo={schedule} />
              ) : (
                <EditableScheduleItem schedule={schedule} />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </Timeline.Root>
  );
}
