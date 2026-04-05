import { useState, useMemo, useCallback } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import type { CategoryWithItems } from "@/features/packing/type";
import { useCreateCategoriesFromCheckList } from "@/features/packing/list/hooks/useCreateCategoriesFromCheckList";
import {
  BottomSheet,
  Checkbox,
  SelectableCategoryGrid,
} from "@/shared/components";
import { colors } from "@/shared/constants/colors";

export interface CategoryWithType extends CategoryWithItems {
  category_type?: string;
}

interface CheckListBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  categories: CategoryWithType[];
  tripId: string;
}

const SECTION_CONFIG = [
  { type: "packing", label: "준비물" },
  { type: "shopping", label: "쇼핑" },
  { type: "todo", label: "할일" },
] as const;

export default function CheckListBottomSheet({
  isOpen,
  onClose,
  onSuccess,
  title,
  categories,
  tripId,
}: CheckListBottomSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const createCategories = useCreateCategoriesFromCheckList(tripId, {
    onSuccess: () => {
      onClose();
      setSelectedIds(new Set());
      onSuccess?.();
    },
  });

  const sections = useMemo(() => {
    return SECTION_CONFIG.map(({ type, label }) => ({
      type,
      label,
      categories: categories.filter(
        (c) =>
          c.category_type === type ||
          (type === "packing" && !c.category_type),
      ),
    })).filter((s) => s.categories.length > 0);
  }, [categories]);

  const hasSections = sections.length > 1;

  const handleAddCategories = () => {
    const selectedCategories = categories.filter((cat) =>
      selectedIds.has(cat.id),
    );
    if (selectedCategories.length === 0) return;
    createCategories.mutate(selectedCategories);
  };

  const isAllSelected =
    categories.length > 0 && selectedIds.size === categories.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleClose = () => {
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      adjustForKeyboard={false}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
      primaryButton={{
        text: `추가${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`,
        onClick: handleAddCategories,
        disabled: selectedIds.size === 0 || createCategories.isPending,
        isLoading: createCategories.isPending,
      }}
    >
      <Flex flexDirection="column" h="100%" minHeight="70vh">
        <HStack justify="space-between" align="center" px={4} pt={3}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            카테고리 선택 ({selectedIds.size}/{categories.length})
          </Text>
          <Checkbox
            isChecked={isAllSelected}
            onChange={handleSelectAll}
            label="전체 선택"
            colorScheme={colors.primary.palette}
          />
        </HStack>
        <Box px={4} py={4} flex={1} overflowY="auto">
          {hasSections ? (
            <VStack gap={4} align="stretch">
              {sections.map((section) => (
                <SectionGroup
                  key={section.type}
                  label={section.label}
                  categories={section.categories}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                  onToggleSection={setSelectedIds}
                />
              ))}
            </VStack>
          ) : (
            <SelectableCategoryGrid
              categories={categories}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              subText={(c) => `${c.items.length}개 아이템`}
            />
          )}
        </Box>
      </Flex>
    </BottomSheet>
  );
}

interface SectionGroupProps {
  label: string;
  categories: CategoryWithType[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleSection: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function SectionGroup({
  label,
  categories,
  selectedIds,
  onToggle,
  onToggleSection,
}: SectionGroupProps) {
  const sectionIds = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories],
  );

  const selectedCount = useMemo(
    () => [...selectedIds].filter((id) => sectionIds.has(id)).length,
    [selectedIds, sectionIds],
  );

  const isSectionChecked = selectedCount === categories.length;

  const handleToggleSection = useCallback(() => {
    onToggleSection((prev) => {
      const next = new Set(prev);
      if (isSectionChecked) {
        sectionIds.forEach((id) => next.delete(id));
      } else {
        sectionIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [isSectionChecked, sectionIds, onToggleSection]);

  return (
    <VStack align="stretch" gap={2}>
      <HStack justify="space-between" align="center" px={1}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
          {label} ({selectedCount}/{categories.length})
        </Text>
        <Checkbox
          isChecked={isSectionChecked}
          onChange={handleToggleSection}
          label="전체 선택"
          colorScheme={colors.primary.palette}
        />
      </HStack>
      <SelectableCategoryGrid
        categories={categories}
        selectedIds={selectedIds}
        onToggle={onToggle}
        subText={(c) => `${c.items.length}개 아이템`}
      />
    </VStack>
  );
}
