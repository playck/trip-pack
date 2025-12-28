import { useState, useEffect } from "react";
import { Input, VStack } from "@chakra-ui/react";
import { ConfirmDialog } from "@/shared/components";
import { useUpdateTripTitle } from "@/shared/service/trip/useUpdateTripTitle";

interface TripEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentTitle: string;
}

export function TripEditModal({
  isOpen,
  onClose,
  tripId,
  currentTitle,
}: TripEditModalProps) {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
    }
  }, [isOpen, currentTitle]);

  const updateTripTitleMutation = useUpdateTripTitle(tripId, {
    setTripTitle: () => {},
    setIsEditingTitle: () => {},
  });

  const handleSave = () => {
    if (title.trim() && title.trim() !== currentTitle) {
      updateTripTitleMutation.mutate(title.trim(), {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="여행 제목 수정"
      confirmLabel="저장"
      onConfirm={handleSave}
      isLoading={updateTripTitleMutation.isPending}
      confirmDisabled={!title.trim()}
      size="sm"
    >
      <VStack align="stretch" gap={1}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="여행 제목을 입력하세요"
          maxLength={20}
          autoFocus
        />
      </VStack>
    </ConfirmDialog>
  );
}
