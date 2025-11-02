import { Timeline, Box } from "@chakra-ui/react";
import { StickyNote } from "lucide-react";
import type { Schedule } from "../../types";

interface MemoItemProps {
  memo: Schedule;
  onEdit?: (scheduleId: string, memoText: string) => void;
}

export default function MemoItem({ memo, onEdit }: MemoItemProps) {
  const handleClick = () => {
    if (onEdit) {
      onEdit(memo.id, memo.place_name);
    }
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
        <Box onClick={handleClick} cursor={onEdit ? "pointer" : "default"}>
          <Timeline.Title fontSize="md" fontWeight="semibold">
            {memo.place_name}
          </Timeline.Title>
        </Box>
      </Timeline.Content>
    </Timeline.Item>
  );
}
