import { Timeline, Box, Badge } from "@chakra-ui/react";
import { StickyNote } from "lucide-react";
import type { Schedule } from "../../types";
import { useScheduleContext } from "../../context";

interface MemoItemProps {
  memo: Schedule;
}

export default function MemoItem({ memo }: MemoItemProps) {
  const { onEditMemo, scheduleExpenses } = useScheduleContext();
  const expenseAmount = scheduleExpenses?.[memo.id];
  const hasExpense = expenseAmount !== undefined && expenseAmount > 0;

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

      <Timeline.Content ml={-2} minH="20px">
        <Box onClick={handleClick} cursor="pointer">
          <Timeline.Title fontSize="md" fontWeight="semibold" mb="4px">
            {memo.place_name}
            {hasExpense && (
              <Badge
                colorPalette="gray"
                variant="surface"
                fontSize="xs"
                fontWeight="medium"
              >
                ₩{expenseAmount.toLocaleString()}
              </Badge>
            )}
          </Timeline.Title>
        </Box>
      </Timeline.Content>
    </Timeline.Item>
  );
}
