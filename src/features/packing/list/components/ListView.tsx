import { useState } from "react";
import { VStack, Box, Text, HStack, Badge } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { CombinedCategory } from "./GridView";
import { CATEGORY_ICONS } from "../constants/category";

interface ListViewProps {
  categories: CombinedCategory[];
}

export default function ListView({ categories }: ListViewProps) {
  // 각 카테고리의 펼침/접힘 상태 관리 (기본값: 모두 펼쳐짐)
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialState[category.categoryName] = true;
    });
    return initialState;
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  return (
    <VStack gap={2} align="stretch" w="full">
      {categories.map((category) => {
        // 사용자 정의 카테고리인 경우 iconKey 사용, 아니면 categoryName으로 매핑
        const iconKey =
          "iconKey" in category ? category.iconKey : category.categoryName;
        const IconComponent = CATEGORY_ICONS[iconKey] as LucideIcon;
        const isExpanded = expandedCategories[category.categoryName] ?? true;

        return (
          <VStack
            key={category.categoryName}
            gap={isExpanded ? 3 : 0}
            align="stretch"
          >
            {/* 카테고리 헤더 */}
            <HStack
              as="button"
              justify="space-between"
              align="center"
              w="full"
              p={2}
              px={0}
              borderRadius="md"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
              onClick={() => toggleCategory(category.categoryName)}
              cursor="pointer"
            >
              <HStack gap={2}>
                {isExpanded ? (
                  <ChevronDown size={16} color="#6B7280" />
                ) : (
                  <ChevronRight size={16} color="#6B7280" />
                )}
                {IconComponent && <IconComponent size={18} color="#3182CE" />}
                <Text fontSize="md" fontWeight="semibold" color="gray.800">
                  {category.categoryName}
                </Text>
              </HStack>
              <Badge colorScheme="blue" size="sm">
                {category.items?.length || 0}개
              </Badge>
            </HStack>

            {/* 아이템 목록 */}
            {isExpanded && (
              <VStack gap={3} align="stretch">
                {category.items && category.items.length > 0 ? (
                  category.items.map((item: unknown, index: number) => (
                    <Box
                      key={index}
                      p={3}
                      bg="white"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      shadow="xs"
                    >
                      <Text fontSize="sm" color="gray.700">
                        {typeof item === "string"
                          ? item
                          : (item as { name?: string })?.name || "아이템"}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.400" fontStyle="italic">
                    아이템이 없습니다
                  </Text>
                )}
              </VStack>
            )}
          </VStack>
        );
      })}
    </VStack>
  );
}
