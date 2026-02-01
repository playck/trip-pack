import { useState } from "react";
import { VStack, Input, Text, Textarea } from "@chakra-ui/react";
import { BottomSheet } from "@/shared/components";
import type { Schedule } from "../../types";

interface EditScheduleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  onSave: (
    scheduleId: string,
    updates: { placeName: string; notes?: string }
  ) => void;
}

export default function EditScheduleSheet({
  isOpen,
  onClose,
  schedule,
  onSave,
}: EditScheduleSheetProps) {
  const [placeName, setPlaceName] = useState(schedule.place_name);
  const [notes, setNotes] = useState(schedule.notes || "");

  const handleSave = () => {
    if (placeName.trim()) {
      onSave(schedule.id, {
        placeName: placeName.trim(),
        notes: notes.trim(),
      });
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="일정 수정"
      primaryButton={{
        text: "저장하기",
        onClick: handleSave,
        disabled: !placeName.trim(),
      }}
      secondaryButton={{
        text: "취소",
        onClick: onClose,
      }}
    >
      <VStack gap={4} p={0} align="stretch">
        <VStack gap={2} align="stretch" px={4}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            장소명
          </Text>
          <Input
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="장소명을 입력하세요"
            size="lg"
            borderRadius="xl"
          />
        </VStack>

        <VStack gap={2} align="stretch" px={4}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            메모
          </Text>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="메모를 입력하세요"
            size="lg"
            borderRadius="xl"
            rows={3}
            resize="none"
          />
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
