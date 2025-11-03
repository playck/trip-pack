import { HStack, Button, Box } from "@chakra-ui/react";
import { X, Check, Calendar, Trash2 } from "lucide-react";
import { colors, borderColors, statusColors } from "@/shared/constants/colors";

interface ScheduleActionButtonsProps {
  selectedCount: number;
  hasChanges: boolean;
  isPending: boolean;
  isDeleting?: boolean;
  onBack: () => void;
  onSave: () => void;
  onMoveDate: () => void;
  onDelete: () => void;
}

export default function ScheduleActionButtons({
  selectedCount,
  hasChanges,
  isPending,
  isDeleting = false,
  onBack,
  onSave,
  onMoveDate,
  onDelete,
}: ScheduleActionButtonsProps) {
  return (
    <Box
      position="sticky"
      bottom={0}
      py={4}
      borderTopWidth="1px"
      borderColor={borderColors.default}
      bg="white"
      zIndex={10}
    >
      <HStack gap={3}>
        {selectedCount > 0 ? (
          // 선택 모드
          <>
            <Button
              variant="outline"
              size="lg"
              flex={1}
              onClick={onMoveDate}
              disabled={isDeleting}
            >
              <HStack gap={2}>
                <Calendar size={18} />
                <span>날짜 이동</span>
              </HStack>
            </Button>
            <Button
              variant="solid"
              size="lg"
              flex={1}
              colorPalette={statusColors.error.palette}
              onClick={onDelete}
              disabled={isDeleting}
              loading={isDeleting}
            >
              <HStack gap={2}>
                <Trash2 size={18} />
                <span>삭제 ({selectedCount})</span>
              </HStack>
            </Button>
          </>
        ) : (
          // 기본 모드
          <>
            <Button
              variant="outline"
              size="lg"
              flex={1}
              onClick={onBack}
              disabled={isPending}
            >
              <HStack gap={2}>
                <X size={18} />
                <span>취소</span>
              </HStack>
            </Button>
            <Button
              variant="solid"
              size="lg"
              flex={1}
              colorPalette={colors.primary.palette}
              onClick={onSave}
              disabled={!hasChanges || isPending}
              loading={isPending}
            >
              <HStack gap={2}>
                <Check size={18} />
                <span>저장</span>
              </HStack>
            </Button>
          </>
        )}
      </HStack>
    </Box>
  );
}
