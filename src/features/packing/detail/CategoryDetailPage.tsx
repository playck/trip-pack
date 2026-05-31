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
import { useTripDetail } from "@/features/main/hooks/useTripDetail";

import PackingItemList from "./components/PackingItemList";
import { ItemForm, DeleteCategoryModal, SearchBar } from "./components";
import { useTripChecklist } from "../list/hooks/useTripChecklist";
import { useCreateItem } from "../list/hooks/useCreateItem";
import { useDeleteCategory } from "../list/hooks/useDeleteCategory";
import { useDeleteItems } from "../list/hooks/useDeleteItems";
import { useUpdateCategory } from "../list/hooks/useUpdateCategory";
import type { CategoryWithItems } from "../type";

export default function CategoryDetailPage() {
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
  const { tripId } = useParams({
    from: "/packing/category/$tripId",
  });
  const search = useSearch({
    from: "/packing/category/$tripId",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const categoryParam = (search as { category?: string }).category || "";
  const { categories, error } = useTripChecklist(tripId || "");
  const { trip } = useTripDetail(tripId || "");
  const createItemMutation = useCreateItem(tripId, {
    onSuccess: () => {
      onClose();
      setNewItemName("");
      setNewItemNotes("");
    },
  });
  const deleteCategoryMutation = useDeleteCategory(tripId);
  const [pendingCategoryName, setPendingCategoryName] = useState<string | null>(
    null,
  );
  const updateCategoryMutation = useUpdateCategory(tripId, {
    onSuccess: () => {
      onEditCategoryClose();
      if (pendingCategoryName) {
        navigate({
          to: "/packing/category/$tripId",
          params: { tripId },
          search: { category: pendingCategoryName },
          replace: true,
        });
        setPendingCategoryName(null);
      }
    },
  });
  const deleteItemsMutation = useDeleteItems(tripId, {
    onSuccess: () => {
      setIsEditMode(false);
    },
  });

  const countryCode = trip?.country_code;
  const categoryName = decodeURIComponent(categoryParam);
  const category = categories?.find(
    (cat: CategoryWithItems) => cat.name === categoryName,
  );
  const isEssentialCategory = category?.name === "필수 준비물";

  if (error) {
    return (
      <ErrorMessage
        message={error || "알 수 없는 오류가 발생했습니다"}
        title="체크리스트 불러오기 실패"
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
      search: { tripTitle: undefined },
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
    setPendingCategoryName(newName);
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

  const handleSaveItem = () => {
    if (!newItemName.trim()) {
      toaster.create({
        title: "입력 오류",
        description: "아이템 이름을 입력해주세요.",
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
    });
  };

  const handleCloseItemSheet = () => {
    onClose();
    setNewItemName("");
    setNewItemNotes("");
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
                {!isEssentialCategory && !isEditMode && (
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
            <SearchBar onSearch={handleSearch} />
          </Box>

          <Box px={5} py={3}>
            <PackingItemList
              category={category}
              searchQuery={searchQuery}
              countryCode={countryCode}
              isEditMode={isEditMode}
              isDeleting={deleteItemsMutation.isPending}
              onDeleteItems={handleDeleteItems}
            />
          </Box>
        </VStack>
      </Container>

      {!isEditMode && (
        <>
          <FloatingAddButton
            onClick={handleAddItem}
            ariaLabel="새 아이템 추가"
          />

          <BottomSheet
            isOpen={isOpen}
            onClose={handleCloseItemSheet}
            title="새 아이템 추가"
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
            <ItemForm
              name={newItemName}
              notes={newItemNotes}
              onNameChange={setNewItemName}
              onNotesChange={setNewItemNotes}
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
