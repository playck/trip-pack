import { Text } from "@chakra-ui/react";
import { Modal } from "@/shared/components";
import { useDeleteSchedule } from "../services/useDeleteSchedule";
import type { Schedule } from "../types";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  tripId: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteScheduleModal({
  isOpen,
  onClose,
  schedule,
  tripId,
  onDeleteSuccess,
}: DeleteScheduleModalProps) {
  const deleteScheduleMutation = useDeleteSchedule(tripId, {
    onSuccess: () => {
      onClose();
      onDeleteSuccess?.();
    },
  });

  const handleDeleteConfirm = () => {
    deleteScheduleMutation.mutate(schedule.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 삭제"
      actions={[
        {
          label: "취소",
          onClick: onClose,
          variant: "outline",
          colorPalette: "neutral",
          disabled: deleteScheduleMutation.isPending,
        },
        {
          label: "삭제",
          onClick: handleDeleteConfirm,
          variant: "solid",
          colorPalette: "red",
          isLoading: deleteScheduleMutation.isPending,
          disabled: deleteScheduleMutation.isPending,
        },
      ]}
    >
      <Text>
        <Text as="span" fontWeight="bold">
          "{schedule.place_name}"
        </Text>{" "}
        일정을 삭제하시겠습니까?
        <br />
        삭제된 일정은 복구할 수 없습니다.
      </Text>
    </Modal>
  );
}
