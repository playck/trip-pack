import { VStack, Box, Text, HStack, SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Checkbox } from "@/shared/components";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import { backgrounds, colors, textColors } from "@/shared/constants/colors";
import type { CategoryWithItems } from "@/features/packing/type";

interface ImportCategorySelectProps {
  categories: CategoryWithItems[];
  selectedIds: Set<string>;
  selectableCount: number;
  duplicateCount: number;
  isAllSelected: boolean;
  isCategoryDuplicate: (name: string) => boolean;
  onToggle: (categoryId: string) => void;
  onSelectAll: () => void;
}

export default function ImportCategorySelect({
  categories,
  selectedIds,
  selectableCount,
  duplicateCount,
  isAllSelected,
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

      {/* 선택 헤더 */}
      <HStack justify="space-between" align="center" px={1}>
        <Text fontSize="md" fontWeight="medium" color="gray.600">
          가져올 카테고리 선택 ({selectedIds.size}/{selectableCount})
        </Text>
        {selectableCount > 0 && (
          <Checkbox
            isChecked={isAllSelected}
            onChange={onSelectAll}
            label="전체 선택"
            colorScheme={colors.primary.palette}
          />
        )}
      </HStack>

      {/* 카테고리 그리드 */}
      <Box maxH="50vh" overflowY="auto" pr={1}>
        <SimpleGrid columns={3} gap={4} w="full">
          {categories.map((category) => {
            const IconComponent = (
              category.icon_key
                ? CATEGORY_ICONS[category.icon_key] || Package
                : CATEGORY_ICONS[category.name] || Package
            ) as LucideIcon;
            const isSelected = selectedIds.has(category.id);
            const isDuplicate = isCategoryDuplicate(category.name);

            return (
              <Box
                key={category.id}
                p={3}
                bg={isDuplicate ? "gray.100" : backgrounds.muted}
                borderRadius="xl"
                border="3px solid"
                borderColor={
                  isDuplicate
                    ? "transparent"
                    : isSelected
                      ? `${colors.primary.palette}.500`
                      : "transparent"
                }
                transition="border-color 0.2s"
                cursor={isDuplicate ? "not-allowed" : "pointer"}
                opacity={isDuplicate ? 0.5 : 1}
                onClick={() => onToggle(category.id)}
              >
                <VStack gap={2} w="full">
                  <Box
                    w="12"
                    h="12"
                    bg={isDuplicate ? "gray.200" : backgrounds.primary}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color={
                      isDuplicate
                        ? "gray.400"
                        : `${colors.primary.palette}.500`
                    }
                  >
                    <IconComponent size={28} />
                  </Box>
                  <VStack gap={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      textAlign="center"
                      color={isDuplicate ? "gray.400" : textColors.secondary}
                    >
                      {category.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {isDuplicate
                        ? "이미 있음"
                        : `${category.items.length}개`}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
