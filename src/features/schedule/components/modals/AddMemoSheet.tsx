import { useState } from "react";
import { VStack, Textarea } from "@chakra-ui/react";

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
      primaryButton={{
        onClick: handleMemoSave,
        disabled: !memoText.trim(),
      }}
      secondaryButton={{
        onClick: handleClose,
      }}
    >
      <VStack gap={3} w="full" px={3}>
        <Textarea
          placeholder="메모를 입력 해 주세요."
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          rows={7}
          autoFocus
          w="full"
        />
      </VStack>
    </BottomSheet>
  );
}
