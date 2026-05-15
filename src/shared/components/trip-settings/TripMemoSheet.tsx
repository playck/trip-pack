import { useState, useEffect, useCallback } from "react";
import { Box, Textarea, Text, HStack } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { useUpdateTripMemo } from "@/shared/service/trip/useUpdateTripMemo";

interface TripMemoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentMemo: string | null;
}

const MAX_MEMO_LENGTH = 2000;

export default function TripMemoSheet({
  isOpen,
  onClose,
  tripId,
  currentMemo,
}: TripMemoSheetProps) {
  const [memo, setMemo] = useState(currentMemo ?? "");
  const { mutate: updateMemo, isPending } = useUpdateTripMemo(tripId, {
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      setMemo(currentMemo ?? "");
    }
  }, [isOpen, currentMemo]);

  const trimmedMemo = memo.trim();
  const hasChanged = (trimmedMemo || null) !== currentMemo;

  const handleSave = useCallback(() => {
    updateMemo(trimmedMemo || null);
  }, [trimmedMemo, updateMemo]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="여행 메모"
      size="max"
      primaryButton={{
        text: "저장",
        onClick: handleSave,
        isLoading: isPending,
        disabled: !hasChanged,
      }}
    >
      <Box px={4} pb={4}>
        <Text fontSize="xs" color="gray.500" mb={2}>
          여행에 대한 메모를 자유롭게 작성해보세요.
        </Text>
        <Textarea
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value.slice(0, MAX_MEMO_LENGTH));
          }}
          autoFocus
          minH="500px"
          resize="vertical"
          fontSize="sm"
          borderColor="gray.200"
          _focus={{
            borderColor: "teal.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-teal-400)",
          }}
        />
        <HStack justify="flex-end" mt={1}>
          <Text
            fontSize="xs"
            color={memo.length >= MAX_MEMO_LENGTH ? "red.500" : "gray.400"}
          >
            {memo.length} / {MAX_MEMO_LENGTH}
          </Text>
        </HStack>
      </Box>
    </BottomSheet>
  );
}
