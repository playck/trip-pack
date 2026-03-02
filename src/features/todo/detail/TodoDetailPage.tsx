import {
  Container,
  VStack,
  Text,
  Box,
  HStack,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  BottomSheet,
  EditCategorySheet,
  ErrorMessage,
  FloatingAddButton,
} from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { colors } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";

import { SearchBar } from "@/features/packing/detail/components";
import { DeleteCategoryModal } from "@/features/packing/detail/components";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";
import { useTodoChecklist } from "../list/hooks/useTodoChecklist";
import {
  useCreateTodoItem,
  useUpdateTodoCategory,
  useDeleteTodoCategory,
  useDeleteTodoItems,
} from "../list/hooks/useTodoMutations";
import type { TodoCategoryWithItems } from "../type";
import TodoItemList from "./components/TodoItemList";
import TodoItemForm from "./components/TodoItemForm";

export default function TodoDetailPage() {
  const navigate = useNavigate();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    open: isEditCategoryOpen,
    onOpen: onEditCategoryOpen,
    onClose: onEditCategoryClose,
  } = useDisclosure();
  const { tripId } = useParams({ from: "/todo/category/$tripId" });
  const search = useSearch({ from: "/todo/category/$tripId" });

  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [newItemDueDate, setNewItemDueDate] = useState("");
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const { user } = useAuth();
  const { categoryId: categoryIdParam } = search;
  const { categories, error } = useTodoChecklist(tripId || "");
  const { data: members = [] } = useTripMembers(tripId || "");

  const currentMemberId = members.find(
    (m) => m.user_id === user?.id
  )?.id;

  const createItemMutation = useCreateTodoItem(tripId, {
    onSuccess: () => {
      onClose();
      resetForm();
    },
    showToast: true,
  });

  const deleteCategoryMutation = useDeleteTodoCategory(tripId);
  const deleteItemsMutation = useDeleteTodoItems(tripId, {
    onSuccess: () => setIsEditMode(false),
  });

  const updateCategoryMutation = useUpdateTodoCategory(tripId, {
    onSuccess: () => {
      onEditCategoryClose();
    },
  });

  const category = categories?.find(
    (cat: TodoCategoryWithItems) => cat.id === categoryIdParam
  );

  const resetForm = () => {
    setNewItemName("");
    setNewItemNotes("");
    setNewItemDueDate("");
    setSelectedAssigneeIds([]);
  };

  if (error) {
    return (
      <ErrorMessage
        message={error || "알 수 없는 오류가 발생했습니다"}
        title="할일 리스트 불러오기 실패"
        centered
        fullScreen
      />
    );
  }

  if (!category) {
    return (
      <Container maxW="6xl" py={6}>
        <Text>카테고리를 찾을 수 없습니다.</Text>
      </Container>
    );
  }

  const handleBackClick = () => {
    if (isEditMode) {
      setIsEditMode(false);
      return;
    }
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId },
    });
  };

  const handleAddItem = () => {
    onOpen();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleUpdateCategory = (newName: string, newIconKey: string) => {
    if (!category?.id) return;
    updateCategoryMutation.mutate({
      categoryId: category.id,
      categoryName: newName,
      iconKey: newIconKey,
    });
  };

  const handleDeleteCategory = () => {
    if (category?.id) {
      deleteCategoryMutation.mutate(category.id);
      onDeleteModalClose();
    }
  };

  const handleDeleteItems = (itemIds: string[]) => {
    deleteItemsMutation.mutate(itemIds);
  };

  const handleAssigneeToggle = (memberId: string) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSaveItem = () => {
    if (!newItemName.trim()) {
      toaster.create({
        title: "입력 오류",
        description: "할일 이름을 입력해주세요.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!category?.id) {
      toaster.create({
        title: "오류가 발생했습니다",
        description: "카테고리 정보를 찾을 수 없습니다.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    createItemMutation.mutate({
      categoryId: category.id,
      name: newItemName.trim(),
      notes: newItemNotes.trim() || undefined,
      dueDate: newItemDueDate || undefined,
      assigneeIds:
        selectedAssigneeIds.length > 0 ? selectedAssigneeIds : undefined,
    });
  };

  const handleCloseItemSheet = () => {
    onClose();
    resetForm();
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={0} px={0}>
        <VStack gap={0} align="stretch">
          {/* 헤더 */}
          <Box
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            px={4}
            py={2}
            position="sticky"
            top={`${HEADER_HEIGHT}px`}
            boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)"
            zIndex={100}
          >
            <HStack gap={2} align="center" justify="space-between">
              <HStack gap={2} align="center">
                <Box
                  as="button"
                  p={1}
                  cursor="pointer"
                  onClick={handleBackClick}
                >
                  <ArrowLeft size={20} />
                </Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  {category.name}
                </Text>
              </HStack>
              <HStack gap={1}>
                {!isEditMode && (
                  <>
                    <IconButton
                      aria-label="카테고리 수정"
                      size="sm"
                      variant="ghost"
                      color="gray.600"
                      onClick={onEditCategoryOpen}
                    >
                      <Pencil size={18} />
                    </IconButton>
                    <IconButton
                      aria-label="카테고리 삭제"
                      size="sm"
                      variant="ghost"
                      color="red.500"
                      onClick={onDeleteModalOpen}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </>
                )}
                {(isEditMode || category.items.length > 0) && (
                  <Box
                    as="button"
                    px={3}
                    py={1.5}
                    bg={isEditMode ? colors.primary.palette : "gray.100"}
                    color={isEditMode ? "white" : "gray.600"}
                    fontWeight="medium"
                    fontSize="sm"
                    borderRadius="md"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? "완료" : "편집"}
                  </Box>
                )}
              </HStack>
            </HStack>
            <SearchBar onSearch={handleSearch} placeholder="할일 검색" />
          </Box>

          <Box px={5} py={3}>
            <TodoItemList
              category={category}
              searchQuery={searchQuery}
              tripId={tripId}
              members={members}
              isEditMode={isEditMode}
              isDeleting={deleteItemsMutation.isPending}
              onDeleteItems={handleDeleteItems}
              showOnlyMine={showOnlyMine}
              onToggleShowOnlyMine={() => setShowOnlyMine((prev) => !prev)}
              currentMemberId={currentMemberId}
            />
          </Box>
        </VStack>
      </Container>

      {!isEditMode && (
        <>
          <FloatingAddButton
            onClick={handleAddItem}
            ariaLabel="새 할일 추가"
          />

          <BottomSheet
            isOpen={isOpen}
            onClose={handleCloseItemSheet}
            title="새 할일 추가"
            primaryButton={{
              text: "저장",
              onClick: handleSaveItem,
              isLoading: createItemMutation.isPending,
            }}
            secondaryButton={{
              text: "취소",
              onClick: handleCloseItemSheet,
            }}
          >
            <TodoItemForm
              name={newItemName}
              notes={newItemNotes}
              dueDate={newItemDueDate}
              selectedAssigneeIds={selectedAssigneeIds}
              members={members}
              onNameChange={setNewItemName}
              onNotesChange={setNewItemNotes}
              onDueDateChange={setNewItemDueDate}
              onAssigneeToggle={handleAssigneeToggle}
            />
          </BottomSheet>
        </>
      )}

      <EditCategorySheet
        isOpen={isEditCategoryOpen}
        isLoading={updateCategoryMutation.isPending}
        initialName={category.name}
        initialIconKey={category.icon_key || category.name}
        onSave={handleUpdateCategory}
        onClose={onEditCategoryClose}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={category}
        isDeleting={deleteCategoryMutation.isPending}
        onClose={onDeleteModalClose}
        onDelete={handleDeleteCategory}
      />
    </Box>
  );
}
