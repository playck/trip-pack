import { useState, useEffect } from "react";
import { VStack, Input, Button, Text, Textarea, Box } from "@chakra-ui/react";
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

  useEffect(() => {
    if (isOpen) {
      setPlaceName(schedule.place_name);
      setNotes(schedule.notes || "");
    }
  }, [isOpen, schedule]);

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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="일정 수정">
      <VStack gap={4} p={4} pt={0} align="stretch">
        <VStack gap={2} align="stretch">
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

        <VStack gap={2} align="stretch">
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

        <Box pt={2}>
          <Button
            width="full"
            size="lg"
            colorPalette="teal"
            onClick={handleSave}
            disabled={!placeName.trim()}
          >
            저장하기
          </Button>
        </Box>
      </VStack>
    </BottomSheet>
  );
}
