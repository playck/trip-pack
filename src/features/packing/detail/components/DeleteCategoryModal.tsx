import { Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/shared/components";
import type { CategoryWithItems } from "../../type";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: CategoryWithItems | undefined;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onDelete,
  isDeleting,
}: DeleteCategoryModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 삭제"
      confirmLabel="삭제하기"
      onConfirm={onDelete}
      isDangerous={true}
      isLoading={isDeleting}
    >
      <Text>
        <Text as="span" fontWeight="bold" color="gray.800">
          '{category?.name}'
        </Text>{" "}
        카테고리를 삭제하시겠습니까?
        <br />
        <Text as="span" color="red.500" fontWeight="medium">
          카테고리 안의 모든 아이템도 함께 삭제되며, 삭제된 데이터는 복구할 수
          없습니다.
        </Text>
      </Text>
    </ConfirmDialog>
  );
}
