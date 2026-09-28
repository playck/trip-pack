import { Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/shared/components";

interface DeleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  onDeleteTrip: () => void;
  isLoading?: boolean;
  /** 나를 포함한 멤버 수 */
  memberCount: number;
  /** 일행이 있을 때 삭제 대신 제공하는 경로 */
  onTransferAndLeave: () => void;
}

export function DeleteTripModal({
  isOpen,
  onClose,
  tripTitle,
  onDeleteTrip,
  isLoading = false,
  memberCount,
  onTransferAndLeave,
}: DeleteTripModalProps) {
  const companionCount = memberCount - 1;

  // 여행 삭제는 일행의 짐·일정·경비까지 CASCADE로 지운다 — 일행이 있으면 삭제를 막고 넘기고 나가기로 안내
  if (companionCount > 0) {
    return (
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="일행이 있는 여행이에요"
        confirmLabel="방장 넘기고 나가기"
        onConfirm={onTransferAndLeave}
      >
        <Text>
          <Text as="span" fontWeight="bold" color="gray.800">
            '{tripTitle}'
          </Text>
          에는 일행 {companionCount}명이 함께하고 있어서 삭제할 수 없어요.
          삭제하면 일행이 적은 짐·일정·경비까지 모두 사라지기 때문이에요.
          <br />
          방장을 다른 일행에게 넘기고 나가면 여행은 일행에게 그대로 남아요.
        </Text>
      </ConfirmDialog>
    );
  }

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
          삭제된 여행과 짐·일정·경비는 복구할 수 없습니다.
        </Text>
      </Text>
    </ConfirmDialog>
  );
}
