import { useState, useEffect } from "react";
import CategoryForm from "@/features/packing/list/components/CategoryForm";
import { toaster } from "@/shared/components/ui/toaster";
import BottomSheet from "./BottomSheet";

interface EditCategorySheetProps {
  isOpen: boolean;
  isLoading?: boolean;
  initialName: string;
  initialIconKey: string;
  onSave: (categoryName: string, iconKey: string) => void;
  onClose: () => void;
}

export default function EditCategorySheet({
  isOpen,
  isLoading = false,
  initialName,
  initialIconKey,
  onSave,
  onClose,
}: EditCategorySheetProps) {
  const [categoryName, setCategoryName] = useState(initialName);
  const [selectedIconKey, setSelectedIconKey] = useState(initialIconKey);

  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialName);
      setSelectedIconKey(initialIconKey);
    }
  }, [isOpen, initialName, initialIconKey]);

  const handleSave = () => {
    const name = categoryName.trim();

    if (!name) {
      toaster.create({
        title: "카테고리 이름을 입력해주세요.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (name.length > 15) {
      toaster.create({
        title: "카테고리 이름은 15자 이하로 입력해주세요.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    const validNameRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(name)) {
      toaster.create({
        title: "카테고리 이름에는 한글, 영문, 숫자, 공백, -, _ 만 사용할 수 있습니다.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (!selectedIconKey) {
      toaster.create({
        title: "아이콘을 선택해주세요.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    onSave(name, selectedIconKey);
  };

  const handleClose = () => {
    setCategoryName(initialName);
    setSelectedIconKey(initialIconKey);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="카테고리 수정"
      primaryButton={{
        text: "저장",
        onClick: handleSave,
        isLoading,
      }}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
    >
      <CategoryForm
        categoryName={categoryName}
        selectedIconKey={selectedIconKey}
        autoFocus={isOpen}
        onCategoryNameChange={setCategoryName}
        onIconKeyChange={setSelectedIconKey}
      />
    </BottomSheet>
  );
}
