import { Timeline, Box } from "@chakra-ui/react";
import { StickyNote } from "lucide-react";
import type { Schedule } from "../../types";
import { useScheduleContext } from "../../context";

interface MemoItemProps {
  memo: Schedule;
}

export default function MemoItem({ memo }: MemoItemProps) {
  const { onEditMemo } = useScheduleContext();

  const handleClick = () => {
    onEditMemo(memo.id, memo.place_name, memo.day_number, memo.schedule_date);
  };

  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator>
          <StickyNote size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content minH="40px" display="flex" flexDirection="column">
        <Box onClick={handleClick} cursor="pointer">
          <Timeline.Title fontSize="md" fontWeight="semibold">
            {memo.place_name}
          </Timeline.Title>
        </Box>
      </Timeline.Content>
    </Timeline.Item>
  );
}
