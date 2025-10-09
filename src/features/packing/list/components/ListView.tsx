import { useState, useMemo } from "react";
import { VStack, Box, Text, HStack, Badge, Button } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Minimize2,
  Maximize2,
  Package,
} from "lucide-react";

import type { CategoryWithItems } from "../../type";
import { CATEGORY_ICONS } from "../constants/category";
import { CabinPolicyIcon } from "@/shared/components";
import type { CabinPolicy } from "@/shared/components/CabinPolicyIcon";

type ChecklistItem = CategoryWithItems["items"][0];
interface ListViewProps {
  categories: CategoryWithItems[];
}

export default function ListView({ categories }: ListViewProps) {
  const navigate = useNavigate();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialState[category.name] = true;
    });
    return initialState;
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const getCompletionCount = (category: CategoryWithItems) => {
    if (!category.items || category.items.length === 0)
      return { completed: 0, total: 0 };

    const completed = category.items.filter((item) => item.is_checked).length;

    return { completed, total: category.items.length };
  };

  const handleItemClick = (categoryName: string) => {
    navigate({
      to: "/packing/category/$tripId",
      params: { tripId },
      search: { category: categoryName },
    });
  };

  const isAllExpanded = () => {
    return categories.every(
      (category) => expandedCategories[category.name] !== false
    );
  };
  const allExpanded = isAllExpanded();

  const toggleAllCategories = () => {
    const shouldExpandAll = !isAllExpanded();
    const newState: Record<string, boolean> = {};

    categories.forEach((category) => {
      newState[category.name] = shouldExpandAll;
    });

    setExpandedCategories(newState);
  };

  const sortedItemsByCategory = useMemo(() => {
    const result: Record<string, { item: ChecklistItem; index: number }[]> = {};

    categories.forEach((category) => {
      if (!category.items || category.items.length === 0) {
        result[category.name] = [];
        return;
      }

      result[category.name] = category.items
        .map((item, index: number) => ({ item, index }))
        .sort(({ item: itemA }, { item: itemB }) => {
          const checkedA = itemA.is_checked || false;
          const checkedB = itemB.is_checked || false;

          if (checkedA === checkedB) return 0;
          return checkedA ? 1 : -1;
        });
    });

    return result;
  }, [categories]);

  return (
    <VStack gap={2} align="stretch" w="full" pb="60px">
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
          const IconComponent = (CATEGORY_ICONS[category.name] ||
            Package) as LucideIcon;
          const isExpanded = expandedCategories[category.name] ?? true;
          const { completed, total } = getCompletionCount(category);
          const sortedItems = sortedItemsByCategory[category.name] || [];

          return (
            <VStack key={category.id} gap={isExpanded ? 3 : 0} align="stretch">
              {/* 카테고리 헤더 */}
              <HStack justify="space-between" align="center" w="full">
                <HStack gap={1} onClick={() => toggleCategory(category.name)}>
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
                      {category.name}
                    </Text>
                  </HStack>

                  <Badge colorScheme="blue" size="sm">
                    {completed} / {total}
                  </Badge>
                </HStack>

                <HStack gap={2}>
                  <Box
                    as="button"
                    w="8"
                    h="8"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    onClick={() => handleItemClick(category.name)}
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
                      const checked = item.is_checked || false;

                      return (
                        <Box
                          key={item.id || index}
                          p={3}
                          bg={checked ? "blue.50" : "white"}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={checked ? "blue.200" : "gray.200"}
                          shadow="xs"
                        >
                          <HStack justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.700">
                              {item.name}
                            </Text>
                            <CabinPolicyIcon
                              policy={item.cabin_policy as CabinPolicy}
                              size={12}
                            />
                          </HStack>
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
