import { Timeline, HStack, Box } from "@chakra-ui/react";
import { StickyNote } from "lucide-react";
import type { Schedule } from "../../types";
import DragHandle from "./DragHandle";

interface EditableMemoItemProps {
  memo: Schedule;
}

export default function EditableMemoItem({ memo }: EditableMemoItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator mt="5px">
          <StickyNote size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content>
        <HStack justify="space-between" align="center" gap={2}>
          <Box flex={1}>
            <Timeline.Title fontSize="md" fontWeight="semibold">
              {memo.place_name}
            </Timeline.Title>
          </Box>

          <DragHandle />
        </HStack>
      </Timeline.Content>
    </Timeline.Item>
  );
}
