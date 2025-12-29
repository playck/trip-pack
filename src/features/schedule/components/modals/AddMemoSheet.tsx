import { useState, useEffect } from "react";
import { VStack, HStack, Textarea, Button } from "@chakra-ui/react";

import BottomSheet from "@/shared/components/BottomSheet";

interface AddMemoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMemo: (memoText: string) => void;
  dayNumber: number;
  date: string;
  initialMemoText?: string;
  isEditMode?: boolean;
}

export default function AddMemoSheet({
  isOpen,
  onClose,
  onSaveMemo,
  dayNumber,
  initialMemoText = "",
  isEditMode = false,
}: AddMemoSheetProps) {
  const [memoText, setMemoText] = useState(initialMemoText);

  useEffect(() => {
    if (isOpen) {
      setMemoText(initialMemoText);
    }
  }, [isOpen, initialMemoText]);

  const handleMemoSave = () => {
    if (memoText.trim()) {
      onSaveMemo(memoText.trim());
      setMemoText("");
      onClose();
    }
  };

  const handleClose = () => {
    setMemoText("");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={`${dayNumber}일차 메모 ${isEditMode ? "수정" : "추가"}`}
      minHeight="35vh"
    >
      <VStack gap={3} w="full" p={3}>
        <Textarea
          placeholder="메모를 입력 해 주세요."
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          rows={7}
          autoFocus
          w="full"
        />

        <HStack gap={2} w="full" h="12">
          <Button
            variant="outline"
            size="lg"
            flex={1}
            fontWeight="medium"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            variant="solid"
            size="lg"
            flex={1}
            colorPalette="teal"
            fontWeight="medium"
            onClick={handleMemoSave}
            disabled={!memoText.trim()}
          >
            저장
          </Button>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
