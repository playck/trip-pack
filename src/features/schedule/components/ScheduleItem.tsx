import { Text, Timeline } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import type { Schedule } from "../types";

interface ScheduleItemProps {
  schedule: Schedule;
}

export default function ScheduleItem({ schedule }: ScheduleItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator>
          <MapPin size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content>
        <Timeline.Title fontSize="md" fontWeight="semibold">
          {schedule.place_name}
        </Timeline.Title>
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
        {schedule.notes && (
          <Text fontSize="sm" color={textColors.subtle} mt={1}>
            {schedule.notes}
          </Text>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
}
