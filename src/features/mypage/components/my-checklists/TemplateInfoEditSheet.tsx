import { useState, useEffect } from "react";
import { VStack, Text, Input } from "@chakra-ui/react";
import { BottomSheet } from "@/shared/components";

interface TemplateInfoEditSheetProps {
  isOpen: boolean;
  title: string;
  description: string | null;
  onSave: (title: string, description: string | null) => void;
  onClose: () => void;
}

export default function TemplateInfoEditSheet({
  isOpen,
  title,
  description,
  onSave,
  onClose,
}: TemplateInfoEditSheetProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEditTitle(title);
      setEditDescription(description || "");
    }
  }, [isOpen, title, description]);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onSave(editTitle.trim(), editDescription.trim() || null);
  };

  const handleClose = () => {
    setEditTitle("");
    setEditDescription("");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="템플릿 정보 수정"
      primaryButton={{
        text: "저장",
        onClick: handleSave,
      }}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
    >
      <VStack gap={4} p={3} w="full" align="stretch">
        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            제목
          </Text>
          <Input
            value={editTitle}
            placeholder="템플릿 제목"
            size="md"
            borderRadius="md"
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </VStack>
        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            설명 (선택)
          </Text>
          <Input
            value={editDescription}
            placeholder="템플릿 설명"
            size="md"
            borderRadius="md"
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
