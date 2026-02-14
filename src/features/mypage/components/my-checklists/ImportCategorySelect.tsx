import { VStack, Box, Text } from "@chakra-ui/react";
import { SelectableCategoryGrid } from "@/shared/components";
import type { TemplateCategoryWithItems } from "@/features/packing/type";

interface ImportCategorySelectProps {
  categories: TemplateCategoryWithItems[];
  selectedIds: Set<string>;
  selectableCount: number;
  duplicateCount: number;
  isCategoryDuplicate: (name: string) => boolean;
  onToggle: (categoryId: string) => void;
  onSelectAll: () => void;
}

export default function ImportCategorySelect({
  categories,
  selectedIds,
  selectableCount,
  duplicateCount,
  isCategoryDuplicate,
  onToggle,
  onSelectAll,
}: ImportCategorySelectProps) {
  return (
    <VStack gap={3} align="stretch" p={3}>
      {/* 중복 안내 */}
      {duplicateCount > 0 && (
        <Box px={2} py={2} bg="orange.50" borderRadius="md">
          <Text fontSize="xs" color="orange.600">
            이미 동일한 이름의 카테고리가 {duplicateCount}개 있어 선택할 수
            없습니다.
          </Text>
        </Box>
      )}

      {/* 카테고리 그리드 */}
      <Box maxH="50vh" overflowY="auto" pr={1}>
        <SelectableCategoryGrid
          categories={categories}
          selectedIds={selectedIds}
          onToggle={onToggle}
          showSelectAll={selectableCount > 0}
          onSelectAll={onSelectAll}
          selectLabel={`가져올 카테고리 선택 (${selectedIds.size}/${selectableCount})`}
          isDisabled={(c) => isCategoryDuplicate(c.name)}
          subText={(c) =>
            isCategoryDuplicate(c.name)
              ? "이미 있음"
              : `${c.template_items.length}개`
          }
        />
      </Box>
    </VStack>
  );
}
