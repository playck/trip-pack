import { VStack, Button, Text, HStack, useDisclosure } from "@chakra-ui/react";
import { Edit3, Trash2 } from "lucide-react";

import { BottomSheet, Modal } from "@/shared/components";
import { useDeleteItem } from "../../list/hooks/useDeleteItem";

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
      <VStack gap={0} w="full">
        <Button
          variant="ghost"
          size="lg"
          w="full"
          h="14"
          justifyContent="flex-start"
          color="gray.800"
          fontWeight="medium"
          _active={{ bg: "gray.100" }}
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
          color="red.500"
          fontWeight="medium"
          _active={{ bg: "red.100" }}
          onClick={handleDeleteBtnClick}
        >
          <HStack gap={3} w="full">
            <Trash2 size={18} />
            <Text>삭제하기</Text>
          </HStack>
        </Button>
      </VStack>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        title="아이템 삭제"
        actions={[
          {
            label: "취소",
            onClick: onDeleteModalClose,
            variant: "outline",
            colorPalette: "neutral",
            disabled: deleteItemMutation.isPending,
          },
          {
            label: "삭제",
            onClick: handleDeleteConfirm,
            variant: "solid",
            colorPalette: "red",
            isLoading: deleteItemMutation.isPending,
            disabled: deleteItemMutation.isPending,
          },
        ]}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{itemName}"
          </Text>{" "}
          아이템을 삭제하시겠습니까?
          <br />
          삭제된 아이템은 복구할 수 없습니다.
        </Text>
      </Modal>
    </BottomSheet>
  );
}
