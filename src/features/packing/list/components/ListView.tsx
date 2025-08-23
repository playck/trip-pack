import { useState } from "react";
import { VStack, Box, Text, HStack, Badge } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { useAtomValue } from "jotai";
import { useNavigate } from "@tanstack/react-router";

import type { CombinedCategory } from "./GridView";
import { CATEGORY_ICONS } from "../constants/category";
import { checkedItemsAtom } from "../store/checklistAtom";

interface ListViewProps {
  categories: CombinedCategory[];
}

export default function ListView({ categories }: ListViewProps) {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialState[category.categoryName] = true;
    });
    return initialState;
  });

  const checkedItems = useAtomValue(checkedItemsAtom);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const isItemChecked = (categoryName: string, itemName: string) => {
    const key = `${categoryName}-${itemName}`;
    return !!checkedItems[key];
  };

  const handleItemClick = (categoryName: string) => {
    navigate({ to: `/packing/category/${categoryName}` });
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
            <HStack justify="space-between" align="center" w="full">
              <HStack
                gap={1}
                onClick={() => toggleCategory(category.categoryName)}
              >
                {/* 펼침/접힘 버튼 */}
                <Box
                  as="button"
                  w="6"
                  h="6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} color="#6B7280" />
                  ) : (
                    <ChevronRight size={16} color="#6B7280" />
                  )}
                </Box>

                {/* 카테고리 정보 */}
                <HStack gap={2}>
                  {IconComponent && <IconComponent size={18} color="#3182CE" />}
                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                    {category.categoryName}
                  </Text>
                </HStack>
              </HStack>

              <HStack gap={2}>
                <Badge colorScheme="blue" size="sm">
                  {category.items?.length || 0}개
                </Badge>

                {/* 상세 페이지 이동 버튼 */}
                <Box
                  as="button"
                  w="8"
                  h="8"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleItemClick(category.categoryName)}
                  cursor="pointer"
                >
                  <ArrowRight size={16} color="#6B7280" />
                </Box>
              </HStack>
            </HStack>

            {/* 아이템 목록 */}
            {isExpanded && (
              <VStack gap={3} align="stretch">
                {category.items && category.items.length > 0 ? (
                  category.items.map((item: unknown, index: number) => {
                    const itemName =
                      typeof item === "string"
                        ? item
                        : (item as { name?: string })?.name || "아이템";
                    const checked = isItemChecked(
                      category.categoryName,
                      itemName
                    );

                    return (
                      <Box
                        key={index}
                        p={3}
                        bg={checked ? "blue.50" : "white"}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={checked ? "blue.200" : "gray.200"}
                        shadow="xs"
                      >
                        <Text fontSize="sm" color="gray.700">
                          {itemName}
                        </Text>
                      </Box>
                    );
                  })
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
