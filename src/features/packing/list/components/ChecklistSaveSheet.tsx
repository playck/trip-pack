import { useState, useEffect, useMemo, useCallback } from "react";
import { VStack, Text, Box, Input, HStack } from "@chakra-ui/react";

import { colors } from "@/shared/constants/colors";
import {
  BottomSheet,
  Checkbox,
  SelectableCategoryGrid,
} from "@/shared/components";
import type { TripInfo } from "@/shared/service/trip/tripInfo";
import type { BaseCategoryWithItems } from "@/shared/components/SelectableCategoryGrid";
import { useSaveAsTemplate } from "../../template/hooks/useSaveAsTemplate";

interface SaveableCategory extends BaseCategoryWithItems {
  items: { name: string; notes: string | null; is_required?: boolean | null }[];
}

interface ChecklistSaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  packingCategories: SaveableCategory[];
  shoppingCategories: SaveableCategory[];
  todoCategories: SaveableCategory[];
  tripInfo: TripInfo | null;
}

export default function ChecklistSaveSheet({
  isOpen,
  onClose,
  packingCategories,
  shoppingCategories,
  todoCategories,
  tripInfo,
}: ChecklistSaveSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState("");

  const { handleSaveAsTemplate, isLoading, isSuccess } = useSaveAsTemplate();

  const hasPacking = packingCategories.length > 0;
  const hasShopping = shoppingCategories.length > 0;
  const hasTodo = todoCategories.length > 0;

  const packingIds = useMemo(
    () => new Set(packingCategories.map((c) => c.id)),
    [packingCategories],
  );
  const shoppingIds = useMemo(
    () => new Set(shoppingCategories.map((c) => c.id)),
    [shoppingCategories],
  );
  const todoIds = useMemo(
    () => new Set(todoCategories.map((c) => c.id)),
    [todoCategories],
  );

  const selectedPackingIds = useMemo(
    () => new Set([...selectedIds].filter((id) => packingIds.has(id))),
    [selectedIds, packingIds],
  );
  const selectedShoppingIds = useMemo(
    () => new Set([...selectedIds].filter((id) => shoppingIds.has(id))),
    [selectedIds, shoppingIds],
  );
  const selectedTodoIds = useMemo(
    () => new Set([...selectedIds].filter((id) => todoIds.has(id))),
    [selectedIds, todoIds],
  );

  const isPackingSectionChecked =
    hasPacking && selectedPackingIds.size === packingCategories.length;
  const isShoppingSectionChecked =
    hasShopping && selectedShoppingIds.size === shoppingCategories.length;
  const isTodoSectionChecked =
    hasTodo && selectedTodoIds.size === todoCategories.length;

  const defaultTemplateName = tripInfo?.title
    ? `${tripInfo.title} 체크리스트`
    : "체크리스트";

  useEffect(() => {
    if (isOpen) {
      const allIds = new Set([
        ...packingCategories.map((c) => c.id),
        ...shoppingCategories.map((c) => c.id),
        ...todoCategories.map((c) => c.id),
      ]);
      setSelectedIds(allIds);
      setTemplateName(defaultTemplateName);
    }
  }, [
    isOpen,
    packingCategories,
    shoppingCategories,
    todoCategories,
    defaultTemplateName,
  ]);

  useEffect(() => {
    if (isSuccess && isOpen) {
      onClose();
    }
  }, [isSuccess, isOpen, onClose]);

  const makeToggleSection = useCallback(
    (ids: Set<string>, isChecked: boolean) => () => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (isChecked) {
          ids.forEach((id) => next.delete(id));
        } else {
          ids.forEach((id) => next.add(id));
        }
        return next;
      });
    },
    [],
  );

  const handleToggleSectionPacking = useMemo(
    () => makeToggleSection(packingIds, isPackingSectionChecked),
    [makeToggleSection, packingIds, isPackingSectionChecked],
  );
  const handleToggleSectionShopping = useMemo(
    () => makeToggleSection(shoppingIds, isShoppingSectionChecked),
    [makeToggleSection, shoppingIds, isShoppingSectionChecked],
  );
  const handleToggleSectionTodo = useMemo(
    () => makeToggleSection(todoIds, isTodoSectionChecked),
    [makeToggleSection, todoIds, isTodoSectionChecked],
  );

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const handleSave = () => {
    const packingWithType = packingCategories.map((c) => ({
      ...c,
      category_type: "packing" as const,
    }));
    const shoppingWithType = shoppingCategories.map((c) => ({
      ...c,
      category_type: "shopping" as const,
    }));
    const todoWithType = todoCategories.map((c) => ({
      ...c,
      category_type: "todo" as const,
    }));
    const allCategories = [
      ...packingWithType,
      ...shoppingWithType,
      ...todoWithType,
    ];
    const selectedCategories = allCategories.filter((c) =>
      selectedIds.has(c.id),
    );
    const trimmedName = templateName.trim();
    handleSaveAsTemplate(
      tripInfo,
      selectedCategories,
      trimmedName || undefined,
    );
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setTemplateName("");
    onClose();
  };

  const totalCount =
    packingCategories.length +
    shoppingCategories.length +
    todoCategories.length;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="체크리스트 템플릿 저장"
      expanded
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
      <VStack gap={3} align="stretch" px={3} flex={1}>
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

        <Text fontSize="sm" color="gray.500">
          저장할 카테고리 선택 ({selectedIds.size}/{totalCount})
        </Text>

        <Box
          flex={1}
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
          <VStack gap={4} align="stretch">
            {hasPacking && (
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between" align="center" px={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    준비물 ({selectedPackingIds.size}/{packingCategories.length}
                    )
                  </Text>
                  <Checkbox
                    isChecked={isPackingSectionChecked}
                    onChange={handleToggleSectionPacking}
                    label="전체 선택"
                    colorScheme={colors.primary.palette}
                  />
                </HStack>
                <SelectableCategoryGrid
                  categories={packingCategories}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                />
              </VStack>
            )}

            {hasShopping && (
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between" align="center" px={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    쇼핑 ({selectedShoppingIds.size}/{shoppingCategories.length}
                    )
                  </Text>
                  <Checkbox
                    isChecked={isShoppingSectionChecked}
                    onChange={handleToggleSectionShopping}
                    label="전체 선택"
                    colorScheme={colors.primary.palette}
                  />
                </HStack>
                <SelectableCategoryGrid
                  categories={shoppingCategories}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                />
              </VStack>
            )}

            {hasTodo && (
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between" align="center" px={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    할일 ({selectedTodoIds.size}/{todoCategories.length})
                  </Text>
                  <Checkbox
                    isChecked={isTodoSectionChecked}
                    onChange={handleToggleSectionTodo}
                    label="전체 선택"
                    colorScheme={colors.primary.palette}
                  />
                </HStack>
                <SelectableCategoryGrid
                  categories={todoCategories}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                />
              </VStack>
            )}
          </VStack>
        </Box>
      </VStack>
    </BottomSheet>
  );
}
