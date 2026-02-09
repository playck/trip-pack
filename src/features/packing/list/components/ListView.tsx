import { useState, useMemo } from "react";
import {
  VStack,
  Box,
  Text,
  HStack,
  Badge,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
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

import { CabinPolicyIcon } from "@/shared/components";
import type { CabinPolicy } from "@/shared/data/checkList";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";

import type { CategoryWithItems } from "../../type";
import { CATEGORY_ICONS } from "../constants/category";
import PackingItemPolicyContainer from "./PackingItemPolicyContainer";

type ChecklistItem = CategoryWithItems["items"][0];
interface ListViewProps {
  categories: CategoryWithItems[];
  onToggleItem?: (itemId: string, isChecked: boolean) => void;
  countryCode?: string | null;
}

export default function ListView({
  categories,
  onToggleItem,
  countryCode,
}: ListViewProps) {
  const navigate = useNavigate();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const {
    open: isPolicyOpen,
    onOpen: onPolicyOpen,
    onClose: onPolicyClose,
  } = useDisclosure();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialState[category.id] = true;
    });
    return initialState;
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
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
      (category) => expandedCategories[category.id] !== false
    );
  };
  const allExpanded = isAllExpanded();

  const toggleAllCategories = () => {
    const shouldExpandAll = !isAllExpanded();
    const newState: Record<string, boolean> = {};

    categories.forEach((category) => {
      newState[category.id] = shouldExpandAll;
    });

    setExpandedCategories(newState);
  };

  const sortedItemsByCategory = useMemo(() => {
    const result: Record<string, { item: ChecklistItem; index: number }[]> = {};

    categories.forEach((category) => {
      if (!category.items || category.items.length === 0) {
        result[category.id] = [];
        return;
      }

      result[category.id] = category.items.map((item, index: number) => ({
        item,
        index,
      }));
    });

    return result;
  }, [categories]);

  const handlePolicyClick = (e: React.MouseEvent, item: ChecklistItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    onPolicyOpen();
  };

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
          const IconComponent = (
            category.icon_key
              ? CATEGORY_ICONS[category.icon_key] || Package
              : CATEGORY_ICONS[category.name] || Package
          ) as LucideIcon;
          const isExpanded = expandedCategories[category.id] ?? true;
          const { completed, total } = getCompletionCount(category);
          const sortedItems = sortedItemsByCategory[category.id] || [];

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
              {/* 카테고리 헤더 */}
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

                  {/* 카테고리 정보 */}
                  <HStack gap={2}>
                    {IconComponent && (
                      <IconComponent size={18} color={colors.primary.hex[500]} />
                    )}
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {category.name}
                    </Text>
                  </HStack>

                  <Badge colorScheme={colors.primary.palette} size="sm">
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
                          bg={
                            checked ? `${colors.primary.palette}.50` : "white"
                          }
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
                          _active={{
                            transform: "scale(0.98)",
                          }}
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
                            {item.cabin_policy &&
                              item.cabin_policy !== "allowed" && (
                                <CabinPolicyIcon
                                  policy={item.cabin_policy as CabinPolicy}
                                  size={16}
                                  onClick={(e) => handlePolicyClick(e, item)}
                                />
                              )}
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

      <PackingItemPolicyContainer
        isOpen={isPolicyOpen}
        onClose={onPolicyClose}
        item={selectedItem}
        countryCode={countryCode}
      />
    </VStack>
  );
}
