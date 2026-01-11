import { Text, Timeline, HStack, Box } from "@chakra-ui/react";
import { MapPin, Check } from "lucide-react";
import { textColors, colors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import DragHandle from "./DragHandle";

interface EditableScheduleItemProps {
  schedule: Schedule;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export default function EditableScheduleItem({
  schedule,
  isSelected = false,
  onToggleSelect,
}: EditableScheduleItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator mt={schedule.notes ? "0" : "5px"} bg="white">
          <MapPin size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content ml={-2}>
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

          <HStack gap={2.5}>
            <Box
              cursor="pointer"
              onClick={onToggleSelect}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="22px"
              h="22px"
              borderRadius="50%"
              borderWidth="2px"
              borderColor={isSelected ? colors.primary.fg : "gray.400"}
              bg={isSelected ? colors.primary.fg : "transparent"}
              color={isSelected ? "white" : "gray.400"}
            >
              <Check size={14} strokeWidth={3} />
            </Box>

            <DragHandle />
          </HStack>
        </HStack>
      </Timeline.Content>
    </Timeline.Item>
  );
}
