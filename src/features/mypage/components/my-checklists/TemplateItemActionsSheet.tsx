import {
  VStack,
  Button,
  Text,
  HStack,
  StackSeparator,
} from "@chakra-ui/react";
import { Edit3, Trash2 } from "lucide-react";
import { BottomSheet } from "@/shared/components";
import { borderColors } from "@/shared/constants/colors";

interface TemplateItemActionsSheetProps {
  isOpen: boolean;
  itemName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function TemplateItemActionsSheet({
  isOpen,
  itemName,
  onEdit,
  onDelete,
  onClose,
}: TemplateItemActionsSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={itemName}>
      <VStack
        gap={0}
        px={3}
        w="full"
        separator={<StackSeparator borderColor={borderColors.default} />}
      >
        <Button
          variant="ghost"
          size="lg"
          w="full"
          h="14"
          justifyContent="flex-start"
          px={2}
          color="gray.800"
          fontWeight="medium"
          onClick={onEdit}
        >
          <HStack gap={3} w="full" p={0}>
            <Edit3 size={18} />
            <Text>수정하기</Text>
          </HStack>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          w="full"
          h="14"
          justifyContent="flex-start"
          px={2}
          color="red.500"
          fontWeight="medium"
          onClick={onDelete}
        >
          <HStack gap={3} w="full">
            <Trash2 size={18} />
            <Text>삭제하기</Text>
          </HStack>
        </Button>
      </VStack>
    </BottomSheet>
  );
}
