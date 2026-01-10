import {
  VStack,
  Button,
  Text,
  HStack,
  useDisclosure,
  StackSeparator,
} from "@chakra-ui/react";
import { Edit3, Trash2 } from "lucide-react";

import { BottomSheet, ConfirmDialog } from "@/shared/components";
import { useDeleteItem } from "../../list/hooks/useDeleteItem";
import { borderColors } from "@/shared/constants/colors";

interface ItemActionsSheetProps {
  isOpen: boolean;
  itemId: string;
  itemName: string;
  tripId?: string;
  onEdit: () => void;
  onClose: () => void;
}

export default function ItemActionsSheet({
  isOpen,
  itemId,
  itemName,
  tripId,
  onEdit,
  onClose,
}: ItemActionsSheetProps) {
  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const deleteItemMutation = useDeleteItem(tripId, {
    onSuccess: () => {
      onDeleteModalClose();
      onClose();
    },
  });

  const handleEdit = () => {
    onEdit();
  };

  const handleDeleteBtnClick = () => {
    onDeleteModalOpen();
  };

  const handleDeleteConfirm = () => {
    if (itemId) {
      deleteItemMutation.mutate(itemId);
    }
  };

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
          onClick={handleEdit}
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
          onClick={handleDeleteBtnClick}
        >
          <HStack gap={3} w="full">
            <Trash2 size={18} />
            <Text>삭제하기</Text>
          </HStack>
        </Button>
      </VStack>

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        title="아이템 삭제"
        confirmLabel="삭제"
        onConfirm={handleDeleteConfirm}
        isDangerous={true}
        isLoading={deleteItemMutation.isPending}
        confirmDisabled={deleteItemMutation.isPending}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{itemName}"
          </Text>{" "}
          아이템을 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            삭제된 아이템은 복구할 수 없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </BottomSheet>
  );
}
