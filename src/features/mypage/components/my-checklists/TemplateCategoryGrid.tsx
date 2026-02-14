import { useState, useEffect } from "react";
import { HStack, Text, Box, Button, useDisclosure } from "@chakra-ui/react";
import type { TemplateCategoryWithItems } from "@/features/packing/type";
import {
  Checkbox,
  ConfirmDialog,
  SelectableCategoryGrid,
} from "@/shared/components";
import { colors, statusColors } from "@/shared/constants/colors";

interface TemplateCategoryGridProps {
  categories: TemplateCategoryWithItems[];
  isEditMode?: boolean;
  onCategoryClick: (category: TemplateCategoryWithItems) => void;
  onDeleteCategories: (categoryIds: string[]) => void;
}

export default function TemplateCategoryGrid({
  categories,
  isEditMode = false,
  onCategoryClick,
  onDeleteCategories,
}: TemplateCategoryGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {
    open: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditMode) {
      setSelectedIds(new Set());
    }
  }, [isEditMode]);

  const handleToggle = (categoryId: string) => {
    if (isEditMode) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
        }
        return next;
      });
    } else {
      const category = categories.find((c) => c.id === categoryId);
      if (category) onCategoryClick(category);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((cat) => cat.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0) {
      onDeleteCategories(Array.from(selectedIds));
      setSelectedIds(new Set());
      onDeleteConfirmClose();
    }
  };

  const isAllSelected =
    categories.length > 0 && selectedIds.size === categories.length;

  return (
    <Box>
      {isEditMode && categories.length > 0 && (
        <HStack justify="flex-end" align="center" gap={3} mb={3}>
          <Text fontSize="sm" color="gray.500">
            {selectedIds.size}개 선택됨
          </Text>
          <Checkbox
            isChecked={isAllSelected}
            onChange={handleSelectAll}
            label="전체 선택"
            colorScheme={colors.primary.palette}
          />
        </HStack>
      )}

      <Box pb="80px">
        <SelectableCategoryGrid
          categories={categories}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          subText={(c) => `${c.template_items.length}개 아이템`}
        />
      </Box>

      {isEditMode && selectedIds.size > 0 && (
        <Box position="fixed" bottom={6} left={4} right={4} zIndex={10}>
          <Button
            w="full"
            colorPalette={statusColors.error.palette}
            size="lg"
            aria-label={`선택한 ${selectedIds.size}개 카테고리 삭제`}
            onClick={onDeleteConfirmOpen}
          >
            {selectedIds.size}개 삭제
          </Button>
        </Box>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        title="카테고리 삭제"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteSelected}
        isDangerous={true}
      >
        <Text>
          선택한{" "}
          <Text as="span" fontWeight="bold" color="gray.800">
            {selectedIds.size}개
          </Text>
          의 카테고리를 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            포함된 모든 아이템도 함께 삭제되며, 복구할 수 없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </Box>
  );
}
