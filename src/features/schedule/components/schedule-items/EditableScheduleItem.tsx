import { Text, Timeline, HStack, Box } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import DragHandle from "./DragHandle";

interface EditableScheduleItemProps {
  schedule: Schedule;
}

export default function EditableScheduleItem({
  schedule,
}: EditableScheduleItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator mt="5px">
          <MapPin size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content>
        <HStack justify="space-between" align="center" gap={2}>
          <Box flex={1}>
            <Timeline.Title fontSize="md" fontWeight="semibold">
              {schedule.place_name}
            </Timeline.Title>

            {schedule.notes && (
              <Text fontSize="sm" color={textColors.subtle} mt={1}>
                {schedule.notes}
              </Text>
            )}
          </Box>

          <DragHandle />
        </HStack>
      </Timeline.Content>
    </Timeline.Item>
  );
}
