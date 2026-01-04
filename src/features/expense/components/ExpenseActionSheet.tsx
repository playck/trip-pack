import { VStack, Button, HStack, Text, StackSeparator } from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { borderColors, statusColors } from "@/shared/constants/colors";

interface ExpenseActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  expenseName: string;
}

export default function ExpenseActionSheet({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  expenseName,
}: ExpenseActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={expenseName}>
      <VStack gap={3} p={3} pt={0} align="stretch">
        <VStack
          gap={0}
          align="stretch"
          separator={<StackSeparator borderColor={borderColors.default} />}
        >
          <Button
            variant="ghost"
            size="lg"
            justifyContent="flex-start"
            color="gray.700"
            fontWeight="medium"
            onClick={() => {
              onEdit();
              onClose();
            }}
            h="56px"
            px={2}
          >
            <HStack gap={3}>
              <Edit2 size={20} />
              <Text>수정하기</Text>
            </HStack>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            justifyContent="flex-start"
            color={statusColors.error.text}
            fontWeight="medium"
            onClick={() => {
              onDelete();
              onClose();
            }}
            h="56px"
            px={2}
          >
            <HStack gap={3}>
              <Trash2 size={20} />
              <Text>삭제하기</Text>
            </HStack>
          </Button>
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
