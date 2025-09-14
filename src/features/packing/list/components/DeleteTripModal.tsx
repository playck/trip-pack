import { Text } from "@chakra-ui/react";
import { Modal } from "@/shared/components";

interface DeleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  onDeleteTrip: () => void;
  isLoading?: boolean;
}

export function DeleteTripModal({
  isOpen,
  onClose,
  tripTitle,
  onDeleteTrip,
  isLoading = false,
}: DeleteTripModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="여행 삭제"
      actions={[
        {
          label: "취소",
          onClick: onClose,
          variant: "outline",
          colorPalette: "gray",
        },
        {
          label: "삭제하기",
          onClick: onDeleteTrip,
          variant: "solid",
          colorPalette: "red",
          isLoading,
        },
      ]}
    >
      <Text>
        '{tripTitle}' 여행을 삭제하시겠습니까?
        <br />
        <Text as="span" color="red.600" fontWeight="medium">
          삭제된 여행과 체크리스트는 복구할 수 없습니다.
        </Text>
      </Text>
    </Modal>
  );
}
