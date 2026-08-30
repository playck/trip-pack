import { useState, useMemo } from "react";
import {
  VStack,
  Box,
  Text,
  HStack,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight, ArrowRight, Package } from "lucide-react";

import { CabinPolicyIcon, Checkbox } from "@/shared/components";
import type { CabinPolicy } from "@/shared/data/checkList";
import {
  ESSENTIAL_CATEGORY_NAME,
  findEssentialGuide,
} from "@/shared/data/essentialItemGuides";
import { colors } from "@/shared/constants/colors";

import type { CategoryWithItems } from "../../type";
import { CATEGORY_ICONS } from "../constants/category";
import PackingItemPolicyContainer from "./PackingItemPolicyContainer";
import EssentialGuideButton from "./EssentialGuideButton";
import EssentialItemGuideSheet from "./EssentialItemGuideSheet";

type ChecklistItem = CategoryWithItems["items"][0];
interface ListViewProps {
  categories: CategoryWithItems[];
  onToggleItem?: (itemId: string, isChecked: boolean) => void;
  countryCode?: string | null;
  showUncheckedOnly: boolean;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (categoryId: string) => void;
}

export default function ListView({
  categories,
  onToggleItem,
  countryCode,
  showUncheckedOnly,
  expandedCategories,
  toggleCategory,
}: ListViewProps) {
  const navigate = useNavigate();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [guideItem, setGuideItem] = useState<ChecklistItem | null>(null);
  const {
    open: isPolicyOpen,
    onOpen: onPolicyOpen,
    onClose: onPolicyClose,
  } = useDisclosure();
  const {
    open: isGuideOpen,
    onOpen: onGuideOpen,
    onClose: onGuideClose,
  } = useDisclosure();

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

  const sortedItemsByCategory = useMemo(() => {
    const result: Record<string, { item: ChecklistItem; index: number }[]> = {};

    categories.forEach((category) => {
      if (!category.items || category.items.length === 0) {
        result[category.id] = [];
        return;
      }

      const items = showUncheckedOnly
        ? category.items.filter((item) => !item.is_checked)
        : category.items;

      result[category.id] = items.map((item, index: number) => ({
        item,
        index,
      }));
    });

    return result;
  }, [categories, showUncheckedOnly]);

  const handlePolicyClick = (e: React.MouseEvent, item: ChecklistItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    onPolicyOpen();
  };

  const handleGuideClick = (e: React.MouseEvent, item: ChecklistItem) => {
    e.stopPropagation();
    setGuideItem(item);
    onGuideOpen();
  };

  return (
    <VStack gap={2} align="stretch" w="full">
      <VStack gap={2} align="stretch" w="full">
        {categories.map((category) => {
          const IconComponent = (
            category.icon_key
              ? CATEGORY_ICONS[category.icon_key] || Package
              : CATEGORY_ICONS[category.name] || Package
          ) as LucideIcon;
          const isExpanded = expandedCategories[category.id] ?? true;
          const isEssentialCategory = category.name === ESSENTIAL_CATEGORY_NAME;
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
                      <IconComponent
                        size={18}
                        color={colors.primary.hex[500]}
                      />
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
                            <HStack gap={1} flex={1} minW={0}>
                              <Checkbox
                                isChecked={checked}
                                size="md"
                                colorScheme={colors.primary.palette}
                                onChange={() => {}}
                              />
                              <Text
                                fontSize="sm"
                                color={checked ? "gray.500" : "gray.700"}
                                fontWeight={checked ? "normal" : "medium"}
                              >
                                {item.name}
                              </Text>
                            </HStack>
                            {isEssentialCategory &&
                              findEssentialGuide(item.name) && (
                                <EssentialGuideButton
                                  itemName={item.name}
                                  onClick={(e) => handleGuideClick(e, item)}
                                />
                              )}
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

      <PackingItemPolicyContainer
        isOpen={isPolicyOpen}
        onClose={onPolicyClose}
        item={selectedItem}
        countryCode={countryCode}
      />

      <EssentialItemGuideSheet
        isOpen={isGuideOpen}
        onClose={onGuideClose}
        item={guideItem}
        countryCode={countryCode}
        onToggleCheck={onToggleItem}
      />
    </VStack>
  );
}
