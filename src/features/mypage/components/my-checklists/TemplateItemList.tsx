import { useState, useEffect, useMemo } from "react";
import {
  VStack,
  Box,
  Text,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import type { TemplateItem as TemplateItemType } from "@/features/packing/type";
import { FloatingAddButton, Checkbox, ConfirmDialog } from "@/shared/components";
import { colors, statusColors } from "@/shared/constants/colors";
import TemplateItem from "./TemplateItem";
import TemplateEditItemSheet from "./TemplateEditItemSheet";
import TemplateShoppingItemSheet from "./TemplateShoppingItemSheet";

interface TemplateItemListProps {
  items: TemplateItemType[];
  categoryType?: string;
  searchQuery?: string;
  isEditMode?: boolean;
  onAddItem: (name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onUpdateItem: (itemId: string, name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteItems?: (itemIds: string[]) => void;
}

export default function TemplateItemList({
  items,
  categoryType,
  searchQuery = "",
  isEditMode = false,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDeleteItems,
}: TemplateItemListProps) {
  const {
    open: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    open: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isShopping = categoryType === "shopping";

  // 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  // 편집 모드 종료 시 선택 초기화
  useEffect(() => {
    if (!isEditMode) {
      setSelectedIds(new Set());
    }
  }, [isEditMode]);

  const handleAddItem = (
    name: string,
    notes?: string,
    extra?: { price?: number; quantity?: number },
  ) => {
    onAddItem(name, notes, extra);
    onAddClose();
  };

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

  return (
    <Box pt={isEditMode ? 0.5 : 1}>
      {/* 편집 모드 헤더 */}
      {isEditMode && filteredItems.length > 0 && (
        <HStack justify="flex-end" align="center" gap={3} mb={2}>
          <Text fontSize="sm" color="gray.500">
            {selectedIds.size}개 선택됨
          </Text>
          <Checkbox
            isChecked={isAllSelected}
            onChange={handleSelectAll}
            label="전체 선택"
            colorScheme={colors.primary.palette}
          />
        </HStack>
      )}

      <VStack gap={3} align="stretch" pb="80px">
        {filteredItems.length === 0 ? (
          <Box py={8} textAlign="center">
            <Text color="gray.500" fontSize="sm">
              {searchQuery ? "검색 결과가 없습니다" : "아이템이 없습니다"}
            </Text>
          </Box>
        ) : (
          filteredItems.map((item, idx) => (
            <TemplateItem
              key={item.id || `${item.name}-${idx}`}
              item={item}
              categoryType={categoryType}
              isEditMode={isEditMode}
              isSelected={item.id ? selectedIds.has(item.id) : false}
              onSelect={handleSelect}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </VStack>

      {/* 편집 모드 삭제 버튼 */}
      {isEditMode && selectedIds.size > 0 && (
        <Box position="fixed" bottom={6} left={4} right={4} zIndex={10}>
          <Button
            w="full"
            colorPalette={statusColors.error.palette}
            size="lg"
            onClick={onDeleteConfirmOpen}
          >
            {selectedIds.size}개 삭제
          </Button>
        </Box>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        title="아이템 삭제"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteSelected}
        isDangerous={true}
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

      {!isEditMode && (
        <FloatingAddButton onClick={onAddOpen} ariaLabel="새 아이템 추가" />
      )}

      {isShopping ? (
        <TemplateShoppingItemSheet
          isOpen={isAddOpen}
          onSave={handleAddItem}
          onClose={onAddClose}
        />
      ) : (
        <TemplateEditItemSheet
          isOpen={isAddOpen}
          addTitle={categoryType === "todo" ? "할 일 추가" : "아이템 추가"}
          onSave={handleAddItem}
          onClose={onAddClose}
        />
      )}
    </Box>
  );
}
