import { Timeline, HStack, Box } from "@chakra-ui/react";
import { StickyNote, Check } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import type { Schedule } from "../../types";
import DragHandle from "./DragHandle";

interface EditableMemoItemProps {
  memo: Schedule;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export default function EditableMemoItem({
  memo,
  isSelected = false,
  onToggleSelect,
}: EditableMemoItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator mt="6px" bg="white">
          <StickyNote size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content ml={-2}>
        <HStack justify="space-between" align="center" gap={2}>
          <Box flex={1}>
            <Timeline.Title fontSize="md" fontWeight="semibold">
              {memo.place_name}
            </Timeline.Title>
          </Box>

          <HStack gap={2.5}>
            <Box
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
              cursor="pointer"
              onClick={onToggleSelect}
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
