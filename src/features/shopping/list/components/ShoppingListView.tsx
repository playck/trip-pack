import { useMemo } from "react";
import { VStack, Box, Text, HStack, Badge } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Package,
} from "lucide-react";

import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import type { ShoppingCategoryWithItems } from "../../type";
import { formatShoppingInfo } from "../utils/formatPrice";

interface ShoppingListViewProps {
  categories: ShoppingCategoryWithItems[];
  tripId: string;
  onToggleItem?: (itemId: string, isChecked: boolean) => void;
  showUncheckedOnly: boolean;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (categoryId: string) => void;
}

export default function ShoppingListView({
  categories,
  tripId,
  onToggleItem,
  showUncheckedOnly,
  expandedCategories,
  toggleCategory,
}: ShoppingListViewProps) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate({
      to: "/shopping/category/$tripId",
      params: { tripId },
      search: { categoryId },
    });
  };

  const sortedItemsByCategory = useMemo(() => {
    const result: Record<
      string,
      { item: ShoppingCategoryWithItems["items"][0]; index: number }[]
    > = {};

    categories.forEach((category) => {
      if (!category.items || category.items.length === 0) {
        result[category.id] = [];
        return;
      }

      const items = showUncheckedOnly
        ? category.items.filter((item) => !item.is_checked)
        : category.items;

      result[category.id] = items.map((item, index) => ({ item, index }));
    });

    return result;
  }, [categories, showUncheckedOnly]);

  return (
    <VStack gap={2} align="stretch" w="full">
      {categories.map((category) => {
        const IconComponent = (
          category.icon_key
            ? CATEGORY_ICONS[category.icon_key] || Package
            : Package
        ) as LucideIcon;
        const isExpanded = expandedCategories[category.id] ?? true;
        const completed = category.items.filter((i) => i.is_checked).length;
        const total = category.items.length;
        const sortedItems = sortedItemsByCategory[category.id] ?? [];

        return (
          <VStack
            key={category.id}
            gap={isExpanded ? 3 : 0}
            align="stretch"
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: "auto 200px",
            }}
          >
            <HStack justify="space-between" align="center" w="full">
              <HStack gap={1} onClick={() => toggleCategory(category.id)}>
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
                <HStack gap={2}>
                  <IconComponent size={18} color={colors.primary.hex[500]} />
                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                    {category.name}
                  </Text>
                </HStack>
                <Badge colorScheme={colors.primary.palette} size="sm">
                  {completed} / {total}
                </Badge>
              </HStack>

              <Box
                as="button"
                w="8"
                h="8"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                onClick={() => handleCategoryClick(category.id)}
                cursor="pointer"
              >
                <ArrowRight size={16} color="#6B7280" />
              </Box>
            </HStack>

            {isExpanded && (
              <VStack gap={3} align="stretch">
                {sortedItems.length > 0 ? (
                  sortedItems.map(({ item, index }) => {
                    const checked = item.is_checked ?? false;
                    const info = formatShoppingInfo(
                      item.price,
                      item.quantity
                    );

                    return (
                      <Box
                        key={item.id || index}
                        p={3}
                        bg={checked ? `${colors.primary.palette}.50` : "white"}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={
                          checked
                            ? `${colors.primary.palette}.200`
                            : "gray.200"
                        }
                        shadow="xs"
                        onClick={() => {
                          if (onToggleItem && item.id) {
                            onToggleItem(item.id, !checked);
                          }
                        }}
                        cursor={onToggleItem ? "pointer" : "default"}
                        transition="all 0.2s"
                        _active={{ transform: "scale(0.98)" }}
                      >
                        <HStack justify="space-between" align="center">
                          <HStack gap={1} flex={1}>
                            <Checkbox
                              isChecked={checked}
                              onChange={() => {
                                if (onToggleItem && item.id) {
                                  onToggleItem(item.id, !checked);
                                }
                              }}
                              size="md"
                              colorScheme={colors.primary.palette}
                            />
                            <Text
                              fontSize="sm"
                              color={checked ? "gray.500" : "gray.700"}
                              fontWeight={checked ? "normal" : "medium"}
                            >
                              {item.name}
                            </Text>
                          </HStack>
                          {info ? (
                            <Text fontSize="xs" color="gray.500" flexShrink={0}>
                              {info}
                            </Text>
                          ) : null}
                        </HStack>
                      </Box>
                    );
                  })
                ) : (
                  <Text fontSize="sm" color="gray.400" fontStyle="italic">
                    {showUncheckedOnly
                      ? "모든 항목을 체크했습니다"
                      : "아이템이 없습니다"}
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
