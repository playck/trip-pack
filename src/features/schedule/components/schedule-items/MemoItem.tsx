import { Timeline } from "@chakra-ui/react";
import { StickyNote } from "lucide-react";
import type { Schedule } from "../../types";

interface MemoItemProps {
  memo: Schedule;
}

export default function MemoItem({ memo }: MemoItemProps) {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator>
          <StickyNote size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content minH="40px" display="flex" flexDirection="column">
        <Timeline.Title fontSize="md" fontWeight="semibold">
          {memo.place_name}
        </Timeline.Title>
      </Timeline.Content>
    </Timeline.Item>
  );
}
