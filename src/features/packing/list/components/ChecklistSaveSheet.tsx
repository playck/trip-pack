import { useState, useEffect } from "react";
import { VStack, Text, Box, Input } from "@chakra-ui/react";

import { colors } from "@/shared/constants/colors";
import { BottomSheet, SelectableCategoryGrid } from "@/shared/components";
import type { TripInfo } from "@/shared/service/trip/tripInfo";
import type { CategoryWithItems } from "../../type";
import { useSaveAsTemplate } from "../../template/hooks/useSaveAsTemplate";

interface ChecklistSaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryWithItems[];
  tripInfo: TripInfo | null;
}

export default function ChecklistSaveSheet({
  isOpen,
  onClose,
  categories,
  tripInfo,
}: ChecklistSaveSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState("");

  const { handleSaveAsTemplate, isLoading, isSuccess } = useSaveAsTemplate();

  const defaultTemplateName = tripInfo?.title
    ? `${tripInfo.title} 체크리스트`
    : "체크리스트";

  useEffect(() => {
    if (isOpen) {
      const allIds = new Set(categories.map((c) => c.id));
      setSelectedIds(allIds);
      setTemplateName(defaultTemplateName);
    }
  }, [isOpen, categories, defaultTemplateName]);

  useEffect(() => {
    if (isSuccess && isOpen) {
      onClose();
    }
  }, [isSuccess, isOpen, onClose]);

  const handleToggleAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };

  const handleToggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const handleSave = () => {
    const selectedCategories = categories.filter((c) => selectedIds.has(c.id));
    const trimmedName = templateName.trim();
    handleSaveAsTemplate(
      tripInfo,
      selectedCategories,
      trimmedName || undefined
    );
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setTemplateName("");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="체크리스트 템플릿 저장"
      minHeight="70vh"
      primaryButton={{
        text: "저장",
        onClick: handleSave,
        isLoading,
        disabled: selectedIds.size === 0 || !templateName.trim(),
      }}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
        disabled: isLoading,
      }}
    >
      <VStack gap={3} align="stretch" px={3}>
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            템플릿 이름
          </Text>
          <Input
            value={templateName}
            onChange={handleNameChange}
            placeholder="체크리스트 이름을 입력하세요"
            size="md"
            borderRadius="lg"
            bg="gray.50"
            borderColor="gray.200"
            _focus={{
              borderColor: `${colors.primary.palette}.500`,
              bg: "white",
            }}
          />
        </VStack>

        <Box
          maxH="50vh"
          overflowY="auto"
          pr={1}
          css={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.200",
              borderRadius: "24px",
            },
          }}
        >
          <SelectableCategoryGrid
            categories={categories}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            showSelectAll
            onSelectAll={handleToggleAll}
            selectLabel={`저장할 카테고리 선택 (${selectedIds.size}/${categories.length})`}
          />
        </Box>
      </VStack>
    </BottomSheet>
  );
}
