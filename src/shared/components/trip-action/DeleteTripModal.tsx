import { Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/shared/components";

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
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="여행 삭제"
      confirmLabel="삭제하기"
      onConfirm={onDeleteTrip}
      isDangerous={true}
      isLoading={isLoading}
    >
      <Text>
        <Text as="span" fontWeight="bold" color="gray.800">
          '{tripTitle}'{" "}
        </Text>
        여행을 삭제하시겠습니까?
        <br />
        <Text as="span" color="red.500" fontWeight="medium">
          삭제된 여행과 체크리스트는 복구할 수 없습니다.
        </Text>
      </Text>
    </ConfirmDialog>
  );
}
