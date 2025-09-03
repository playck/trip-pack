import { useState, useMemo } from "react";
import { VStack, Box, Text, HStack, Badge, Button } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Minimize2,
  Maximize2,
} from "lucide-react";

import type { CombinedCategory, CategoryItem } from "./types";
import { getItemName } from "./types";
import { CATEGORY_ICONS } from "../constants/category";
import { checkedItemsAtom } from "../store/checklistAtom";

interface ListViewProps {
  categories: CombinedCategory[];
}

export default function ListView({ categories }: ListViewProps) {
  const navigate = useNavigate();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
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

  const getCompletionCount = (category: CombinedCategory) => {
    if (!category.items || category.items.length === 0)
      return { completed: 0, total: 0 };

    const completed = category.items.filter((item: CategoryItem) => {
      const itemName = getItemName(item);
      return isItemChecked(category.categoryName, itemName);
    }).length;

    return { completed, total: category.items.length };
  };

  const handleItemClick = (categoryName: string) => {
    navigate({
      to: "/packing/category/$tripId",
      params: { tripId },
      search: { category: categoryName },
    });
  };

  // 모든 카테고리가 펼쳐져 있는지 확인
  const isAllExpanded = () => {
    return categories.every(
      (category) => expandedCategories[category.categoryName] !== false
    );
  };
  const allExpanded = isAllExpanded();

  // 모든 카테고리 접기/펼치기 토글
  const toggleAllCategories = () => {
    const shouldExpandAll = !isAllExpanded();
    const newState: Record<string, boolean> = {};

    categories.forEach((category) => {
      newState[category.categoryName] = shouldExpandAll;
    });

    setExpandedCategories(newState);
  };

  // 정렬된 아이템 목록을 초기 로딩 시에만 생성
  const sortedItemsByCategory = useMemo(() => {
    const result: Record<string, { item: CategoryItem; index: number }[]> = {};

    categories.forEach((category) => {
      if (!category.items || category.items.length === 0) {
        result[category.categoryName] = [];
        return;
      }

      result[category.categoryName] = category.items
        .map((item: CategoryItem, index: number) => ({ item, index }))
        .sort(({ item: itemA }, { item: itemB }) => {
          const itemNameA = getItemName(itemA);
          const itemNameB = getItemName(itemB);

          const checkedA = isItemChecked(category.categoryName, itemNameA);
          const checkedB = isItemChecked(category.categoryName, itemNameB);

          if (checkedA === checkedB) return 0;
          return checkedA ? 1 : -1;
        });
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]); // checkedItems는 의도적으로 제외 (초기 로딩 시에만 정렬)

  return (
    <VStack gap={2} align="stretch" w="full">
      {/* 모든 카테고리 접기/펼치기 버튼 */}
      <HStack justify="flex-end" w="full">
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleAllCategories}
          color="gray.600"
          pr={0}
        >
          <HStack gap={1}>
            {allExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <Text>{allExpanded ? "모두 접기" : "모두 펼치기"}</Text>
          </HStack>
        </Button>
      </HStack>

      <VStack gap={2} align="stretch" w="full">
        {categories.map((category) => {
          // 사용자 정의 카테고리인 경우 iconKey 사용, 아니면 categoryName으로 매핑
          const iconKey =
            "iconKey" in category ? category.iconKey : category.categoryName;
          const IconComponent = CATEGORY_ICONS[iconKey] as LucideIcon;
          const isExpanded = expandedCategories[category.categoryName] ?? true;
          const { completed, total } = getCompletionCount(category);
          const sortedItems =
            sortedItemsByCategory[category.categoryName] || [];

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
                    {IconComponent && (
                      <IconComponent size={18} color="#3182CE" />
                    )}
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {category.categoryName}
                    </Text>
                  </HStack>

                  <Badge colorScheme="blue" size="sm">
                    {completed} / {total}
                  </Badge>
                </HStack>

                <HStack gap={2}>
                  {/* 상세 페이지 이동 버튼 */}
                  <Box
                    as="button"
                    w="8"
                    h="8"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
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
                  {sortedItems.length > 0 ? (
                    sortedItems.map(({ item, index }) => {
                      const itemName = getItemName(item);
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
    </VStack>
  );
}
