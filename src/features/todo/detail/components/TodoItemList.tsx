import { useState, useEffect, useMemo, useCallback } from "react";
import {
  VStack,
  Text,
  Box,
  HStack,
  Button,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { CircleCheck, Search, PackageOpen } from "lucide-react";
import { Checkbox, ConfirmDialog } from "@/shared/components";
import { colors, statusColors } from "@/shared/constants/colors";
import TodoItem from "./TodoItem";
import TodoItemActionsSheet from "./TodoItemActionsSheet";
import TodoEditItemSheet from "./TodoEditItemSheet";
import type {
  TodoCategoryWithItems,
  TodoItemWithAssignees,
} from "../../type";
import type { TripMemberWithProfile } from "@/features/trip-members/services/api";
import { useUpdateTodoItemChecked } from "../../list/hooks/useTodoChecklist";

interface TodoItemListProps {
  category: TodoCategoryWithItems;
  searchQuery?: string;
  tripId?: string;
  members: TripMemberWithProfile[];
  isEditMode?: boolean;
  isDeleting?: boolean;
  onDeleteItems?: (itemIds: string[]) => void;
  showOnlyMine: boolean;
  onToggleShowOnlyMine: () => void;
  currentMemberId?: string;
}

export default function TodoItemList({
  category,
  searchQuery = "",
  tripId,
  members,
  isEditMode = false,
  isDeleting = false,
  onDeleteItems,
  showOnlyMine,
  onToggleShowOnlyMine,
  currentMemberId,
}: TodoItemListProps) {
  const updateItemCheckedMutation = useUpdateTodoItemChecked(tripId);

  const [showUncheckedOnly, setShowUncheckedOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<TodoItemWithAssignees | null>(
    null
  );
  const {
    open: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();
  const {
    open: isActionsOpen,
    onOpen: onActionsOpen,
    onClose: onActionsClose,
  } = useDisclosure();
  const {
    open: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const filteredItems = useMemo(() => {
    let items = [...category.items];

    if (searchQuery.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    if (showOnlyMine && currentMemberId) {
      items = items.filter(
        (item) =>
          item.assignees.length === 0 ||
          item.assignees.some((a) => a.member_id === currentMemberId)
      );
    }

    if (showUncheckedOnly) {
      items = items.filter((item) => !item.is_checked);
    }

    return items;
  }, [category.items, searchQuery, showUncheckedOnly, showOnlyMine, currentMemberId]);

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
          filteredItems.map((item) => item.id).filter(Boolean) as string[]
        )
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

  const handleToggleCheck = useCallback(
    (itemId: string, isChecked: boolean) => {
      updateItemCheckedMutation.mutate({ itemId, isChecked });
    },
    [updateItemCheckedMutation]
  );

  const handleOpenActions = useCallback(
    (item: TodoItemWithAssignees) => {
      setActiveItem(item);
      onActionsOpen();
    },
    [onActionsOpen]
  );

  const handleEditFromActions = useCallback(() => {
    onActionsClose();
    onEditOpen();
  }, [onActionsClose, onEditOpen]);

  const isAllSelected =
    filteredItems.length > 0 && selectedIds.size === filteredItems.length;

  const hasItems = category.items.length > 0;
  const emptyState = showOnlyMine
    ? {
        icon: CircleCheck,
        color: `${colors.primary.palette}.500` as const,
        message: "나에게 할당된 할일이 없습니다",
      }
    : showUncheckedOnly
      ? {
          icon: CircleCheck,
          color: `${colors.primary.palette}.500` as const,
          message: "모든 항목을 체크했습니다",
        }
      : searchQuery.trim()
        ? {
            icon: Search,
            color: "gray.400" as const,
            message: `'${searchQuery}' 검색 결과가 없습니다`,
          }
        : {
            icon: PackageOpen,
            color: "gray.400" as const,
            message: "아직 추가된 할일이 없습니다",
          };

  return (
    <Box>
      {hasItems && !isEditMode && (
        <HStack justify="flex-end" mb={2} gap={3}>
          {members.length > 1 && (
            <Checkbox
              isChecked={showOnlyMine}
              onChange={onToggleShowOnlyMine}
              label="내 할일만 보기"
              size="md"
            />
          )}
          <Checkbox
            isChecked={showUncheckedOnly}
            onChange={() => setShowUncheckedOnly((prev) => !prev)}
            label="미체크만 보기"
            size="md"
          />
        </HStack>
      )}

      {filteredItems.length === 0 ? (
        <VStack py={10} gap={2}>
          <Icon as={emptyState.icon} boxSize={10} color={emptyState.color} />
          <Text color="gray.500" fontSize="sm">
            {emptyState.message}
          </Text>
        </VStack>
      ) : null}

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

      {filteredItems.length > 0 && (
        <VStack gap={3} align="stretch" pb="80px">
          {filteredItems.map((item, idx) => (
            <TodoItem
              key={item.id || `${item.name}-${idx}`}
              item={item}
              isEditMode={isEditMode}
              isSelected={item.id ? selectedIds.has(item.id) : false}
              onSelect={handleSelect}
              onToggleCheck={handleToggleCheck}
              onOpenActions={handleOpenActions}
            />
          ))}
        </VStack>
      )}

      {activeItem && (
        <>
          <TodoItemActionsSheet
            isOpen={isActionsOpen}
            itemId={activeItem.id}
            itemName={activeItem.name}
            tripId={tripId}
            onEdit={handleEditFromActions}
            onClose={onActionsClose}
          />

          <TodoEditItemSheet
            isOpen={isEditOpen}
            item={activeItem}
            tripId={tripId}
            members={members}
            onClose={onEditClose}
          />
        </>
      )}

      {isEditMode && selectedIds.size > 0 && (
        <Box position="fixed" bottom={6} left={4} right={4} zIndex={10}>
          <Button
            w="full"
            colorPalette={statusColors.error.palette}
            size="lg"
            aria-label={`선택한 ${selectedIds.size}개 할일 삭제`}
            onClick={onDeleteConfirmOpen}
          >
            {selectedIds.size}개 삭제
          </Button>
        </Box>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        title="할일 삭제"
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
          의 할일을 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            삭제된 할일은 복구할 수 없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </Box>
  );
}
