import { Text } from "@chakra-ui/react";
import { Modal } from "@/shared/components";
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 삭제"
      actions={[
        {
          label: "취소",
          onClick: onClose,
          variant: "outline",
          colorPalette: "gray",
        },
        {
          label: "삭제하기",
          onClick: onDelete,
          variant: "solid",
          colorPalette: "red",
          isLoading: isDeleting,
        },
      ]}
    >
      <Text>
        '{category?.name}' 카테고리를 삭제하시겠습니까?
        <br />
        <Text as="span" color="red.600" fontWeight="medium">
          카테고리 안의 모든 아이템도 함께 삭제되며, 삭제된 데이터는 복구할 수
          없습니다.
        </Text>
      </Text>
    </Modal>
  );
}
