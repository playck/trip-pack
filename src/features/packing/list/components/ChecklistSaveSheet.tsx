import { useState, useEffect } from "react";
import { VStack, Text, HStack, Box, SimpleGrid, Input } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { backgrounds, colors, textColors } from "@/shared/constants/colors";
import { Checkbox } from "@/shared/components";
import type { CategoryWithItems } from "../../type";
import { CATEGORY_ICONS } from "../constants/category";

interface ChecklistSaveSheetProps {
  categories: CategoryWithItems[];
  defaultTemplateName: string;
  onSelectedChange: (selectedIds: Set<string>) => void;
  onTemplateNameChange: (name: string) => void;
}

export default function ChecklistSaveSheet({
  categories,
  defaultTemplateName,
  onSelectedChange,
  onTemplateNameChange,
}: ChecklistSaveSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState(defaultTemplateName);

  // 초기 로드시 모든 카테고리 선택
  useEffect(() => {
    const allIds = categories.map((c) => c.id);
    const initialSet = new Set(allIds);
    setSelectedIds(initialSet);
    onSelectedChange(initialSet);
  }, [categories, onSelectedChange]);

  // 기본 템플릿 이름 설정
  useEffect(() => {
    setTemplateName(defaultTemplateName);
    onTemplateNameChange(defaultTemplateName);
  }, [defaultTemplateName, onTemplateNameChange]);

  const isAllSelected =
    categories.length > 0 && selectedIds.size === categories.length;

  const handleToggleAll = () => {
    let newSelected;
    if (isAllSelected) {
      newSelected = new Set<string>();
    } else {
      newSelected = new Set(categories.map((c) => c.id));
    }
    setSelectedIds(newSelected);
    onSelectedChange(newSelected);
  };

  const handleToggleCategory = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectedChange(newSelected);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTemplateName(newName);
    onTemplateNameChange(newName);
  };

  return (
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


      <HStack justify="space-between" align="center" px={1}>
        <Text fontSize="md" fontWeight="medium" color="gray.600">
          저장할 카테고리 선택 ({selectedIds.size}/{categories.length})
        </Text>
        <Checkbox
          isChecked={isAllSelected}
          onChange={handleToggleAll}
          label="전체 선택"
          colorScheme={colors.primary.palette}
        />
      </HStack>

      {/* 카테고리 그리드 */}
      <Box
        maxH="50vh"
        overflowY="auto"
        pr={1}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.200",
            borderRadius: "24px",
          },
        }}
      >
        <SimpleGrid columns={3} gap={4} w="full">
          {categories.map((category) => {
            const IconComponent = (
              category.icon_key
                ? CATEGORY_ICONS[category.icon_key] || Package
                : CATEGORY_ICONS[category.name] || Package
            ) as LucideIcon;
            const isSelected = selectedIds.has(category.id);

            return (
              <Box
                key={category.id}
                p={3}
                bg={backgrounds.muted}
                borderRadius="xl"
                border="3px solid"
                borderColor={
                  isSelected ? `${colors.primary.palette}.500` : "transparent"
                }
                transition="border-color 0.2s"
                cursor="pointer"
                onClick={() => handleToggleCategory(category.id)}
              >
                <VStack gap={2} w="full">
                  <Box
                    w="12"
                    h="12"
                    bg={backgrounds.primary}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="blue.500"
                  >
                    <IconComponent size={28} />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    textAlign="center"
                    color={textColors.secondary}
                  >
                    {category.name}
                  </Text>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
