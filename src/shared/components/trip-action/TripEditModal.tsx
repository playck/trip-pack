import { useState, useEffect } from "react";
import { Input, VStack } from "@chakra-ui/react";
import { Modal } from "@/shared/components";
import { useUpdateTripTitle } from "@/shared/hooks/useUpdateTripTitle";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="여행 제목 수정"
      size="sm"
      actions={[
        {
          label: "취소",
          onClick: onClose,
          variant: "outline",
          colorPalette: "gray",
        },
        {
          label: "저장",
          onClick: handleSave,
          variant: "solid",
          colorPalette: "teal",
          isLoading: updateTripTitleMutation.isPending,
          disabled: !title.trim(),
        },
      ]}
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
    </Modal>
  );
}
