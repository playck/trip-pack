import { VStack, Button, HStack, Text } from "@chakra-ui/react";
import { Edit2, Wallet, Trash2 } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { statusColors } from "@/shared/constants/colors";

interface ScheduleActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddExpense: () => void;
  onDelete: () => void;
  scheduleName: string;
}

export default function ScheduleActionSheet({
  isOpen,
  onClose,
  onEdit,
  onAddExpense,
  onDelete,
  scheduleName,
}: ScheduleActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="일정 관리">
      <VStack gap={3} p={3} pt={0} align="stretch">
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {scheduleName}
        </Text>

        <Button
          variant="outline"
          size="md"
          justifyContent="flex-start"
          onClick={() => {
            onEdit();
            onClose();
          }}
          h="48px"
        >
          <HStack gap={3} width="full">
            <Edit2 size={20} />
            <Text>일정 수정</Text>
          </HStack>
        </Button>

        <Button
          variant="outline"
          size="md"
          justifyContent="flex-start"
          onClick={() => {
            onAddExpense();
            onClose();
          }}
          h="48px"
        >
          <HStack gap={3} width="full">
            <Wallet size={20} />
            <Text>경비 추가</Text>
          </HStack>
        </Button>

        <Button
          variant="outline"
          size="md"
          justifyContent="flex-start"
          colorPalette="red"
          color={statusColors.error.text}
          borderColor={statusColors.error.border}
          onClick={() => {
            onDelete();
            onClose();
          }}
          h="48px"
        >
          <HStack gap={3} width="full">
            <Trash2 size={20} />
            <Text>일정 삭제</Text>
          </HStack>
        </Button>
      </VStack>
    </BottomSheet>
  );
}
