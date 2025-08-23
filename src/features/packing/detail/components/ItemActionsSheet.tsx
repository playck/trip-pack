import { VStack, Button, Text, HStack } from "@chakra-ui/react";
import { Edit3, Trash2 } from "lucide-react";

import { BottomSheet } from "@/shared/components";

interface ItemActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemActionsSheet({
  isOpen,
  onClose,
  itemName,
  onEdit,
  onDelete,
}: ItemActionsSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={itemName}>
      <VStack gap={0} w="full">
        <Button
          variant="ghost"
          size="lg"
          w="full"
          h="14"
          justifyContent="flex-start"
          color="gray.800"
          fontWeight="medium"
          _hover={{ bg: "gray.50" }}
          _active={{ bg: "gray.100" }}
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
          color="red.500"
          fontWeight="medium"
          _hover={{ bg: "red.50" }}
          _active={{ bg: "red.100" }}
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
