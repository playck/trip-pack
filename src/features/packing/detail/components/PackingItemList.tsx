import { useState, useEffect, useMemo } from "react";
import {
  VStack,
  Text,
  Box,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import PackingItem from "./PackingItem";
import type { CategoryWithItems } from "../../type";
import { Checkbox, ConfirmDialog } from "@/shared/components";
import { colors, statusColors } from "@/shared/constants/colors";

interface PackingItemListProps {
  category: CategoryWithItems;
  searchQuery?: string;
  countryCode?: string | null;
  isEditMode?: boolean;
  isDeleting?: boolean;
  onDeleteItems?: (itemIds: string[]) => void;
}

export default function PackingItemList({
  category,
  searchQuery = "",
  countryCode,
  isEditMode = false,
  isDeleting = false,
  onDeleteItems,
}: PackingItemListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {
    open: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();

  const filteredItems = useMemo(() => {
    let items = [...category.items];

    if (searchQuery.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
    }

    return items;
  }, [category.items, searchQuery]);

  useEffect(() => {
    if (!isEditMode) {
      setSelectedIds(new Set());
    }
  }, [isEditMode]);

  const handleSelect = (itemId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(
          filteredItems.map((item) => item.id).filter(Boolean) as string[],
        ),
      );
    }
  };

  const handleDeleteSelected = () => {
    if (onDeleteItems && selectedIds.size > 0) {
      onDeleteItems(Array.from(selectedIds));
      setSelectedIds(new Set());
      onDeleteConfirmClose();
    }
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedIds.size === filteredItems.length;

  if (filteredItems.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="gray.500" fontSize="sm">
          {searchQuery.trim()
            ? `'${searchQuery}' 검색 결과가 없습니다`
            : "아이템이 없습니다"}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {isEditMode && filteredItems.length > 0 && (
        <HStack justify="flex-end" align="center" gap={3} mb={2}>
          <Text fontSize="sm" color="gray.500">
            {selectedIds.size}개 선택됨
          </Text>
          <Checkbox
            isChecked={isAllSelected}
            onChange={handleSelectAll}
            label={searchQuery.trim() ? "검색 결과 전체 선택" : "전체 선택"}
            colorScheme={colors.primary.palette}
          />
        </HStack>
      )}

      <VStack gap={3} align="stretch" pb="80px">
        {filteredItems.map((item, idx) => (
          <PackingItem
            key={item.id || `${item.name}-${idx}`}
            item={item}
            countryCode={countryCode}
            isEditMode={isEditMode}
            isSelected={item.id ? selectedIds.has(item.id) : false}
            onSelect={handleSelect}
          />
        ))}
      </VStack>

      {isEditMode && selectedIds.size > 0 && (
        <Box position="fixed" bottom={6} left={4} right={4} zIndex={10}>
          <Button
            w="full"
            colorPalette={statusColors.error.palette}
            size="lg"
            aria-label={`선택한 ${selectedIds.size}개 아이템 삭제`}
            onClick={onDeleteConfirmOpen}
          >
            {selectedIds.size}개 삭제
          </Button>
        </Box>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        title="아이템 삭제"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteSelected}
        isDangerous={true}
        isLoading={isDeleting}
      >
        <Text>
          선택한{" "}
          <Text as="span" fontWeight="bold" color="gray.800">
            {selectedIds.size}개
          </Text>
          의 아이템을 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            삭제된 아이템은 복구할 수 없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </Box>
  );
}
