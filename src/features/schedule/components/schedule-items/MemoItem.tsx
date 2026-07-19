import { Timeline, Badge, IconButton } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import type { Schedule } from "../../types";
import { useScheduleContext } from "../../context";
import { getMemoIcon } from "../../memoIcons";

interface MemoItemProps {
  memo: Schedule;
}

export default function MemoItem({ memo }: MemoItemProps) {
  const { onOpenActionSheet, scheduleExpenses } = useScheduleContext();
  const expenseAmount = scheduleExpenses?.[memo.id];
  const hasExpense = expenseAmount !== undefined && expenseAmount > 0;
  const MemoIcon = getMemoIcon(memo.category);

  const handleOpenAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenActionSheet?.(memo);
  };

  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator bg="white">
          <MemoIcon size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content width="full" ml={-2} minH="20px" pb="16px">
        <div style={{ paddingRight: onOpenActionSheet ? "32px" : "0" }}>
          <Timeline.Title
            className="selectable"
            fontSize="md"
            fontWeight="semibold"
            mb="0"
          >
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
        </div>

        {onOpenActionSheet && (
          <IconButton
            aria-label="메모 관리"
            variant="ghost"
            size="xs"
            color="gray.400"
            position="absolute"
            right={0}
            top={-2}
            onClick={handleOpenAction}
          >
            <MoreVertical size={16} />
          </IconButton>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
}
