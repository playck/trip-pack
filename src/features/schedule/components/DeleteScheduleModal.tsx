import { Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/shared/components";
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
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="일정 삭제"
      confirmLabel="삭제"
      onConfirm={handleDeleteConfirm}
      isDangerous={true}
      isLoading={deleteScheduleMutation.isPending}
      confirmDisabled={deleteScheduleMutation.isPending}
    >
      <Text>
        <Text as="span" fontWeight="bold">
          "{schedule.place_name}"
        </Text>{" "}
        일정을 삭제하시겠습니까?
        <br />
        <Text as="span" color="red.500" fontWeight="medium">
          삭제된 일정은 복구할 수 없습니다.
        </Text>
      </Text>
    </ConfirmDialog>
  );
}
