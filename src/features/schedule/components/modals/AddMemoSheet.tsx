import { useEffect, useState } from "react";
import { VStack, Textarea, Text } from "@chakra-ui/react";

import BottomSheet from "@/shared/components/BottomSheet";
import { textColors } from "@/shared/constants/colors";
import { MEMO_ICON_OPTIONS, DEFAULT_MEMO_ICON_KEY } from "../../memoIcons";
import IconPicker from "../IconPicker";

interface AddMemoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMemo: (memoText: string, iconKey: string) => void;
  dayNumber: number;
  date: string;
  initialMemoText?: string;
  initialIconKey?: string;
  isEditMode?: boolean;
}

export default function AddMemoSheet({
  isOpen,
  onClose,
  onSaveMemo,
  dayNumber,
  initialMemoText = "",
  initialIconKey = DEFAULT_MEMO_ICON_KEY,
  isEditMode = false,
}: AddMemoSheetProps) {
  const [memoText, setMemoText] = useState(initialMemoText);
  const [iconKey, setIconKey] = useState(initialIconKey);

  // 시트가 열릴 때마다 초기값과 동기화 (BottomSheet는 unmountOnExit이라
  // 부모 상태가 유지되므로 열림 시점에 명시적으로 맞춰준다)
  useEffect(() => {
    if (isOpen) {
      setMemoText(initialMemoText);
      setIconKey(initialIconKey);
    }
  }, [isOpen, initialMemoText, initialIconKey]);

  const handleMemoSave = () => {
    const trimmed = memoText.trim();
    if (!trimmed) return;
    onSaveMemo(trimmed, iconKey);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${dayNumber}일차 메모 ${isEditMode ? "수정" : "추가"}`}
      primaryButton={{
        onClick: handleMemoSave,
        disabled: !memoText.trim(),
      }}
      secondaryButton={{
        onClick: onClose,
      }}
    >
      <VStack gap={4} w="full" px={3} align="stretch">
        <VStack gap={2} align="stretch">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={textColors.secondary}
          >
            아이콘
          </Text>
          <IconPicker
            options={MEMO_ICON_OPTIONS}
            value={iconKey}
            onChange={setIconKey}
          />
        </VStack>

        <Textarea
          placeholder="메모를 입력 해 주세요."
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          rows={6}
          autoFocus
          w="full"
        />
      </VStack>
    </BottomSheet>
  );
}
