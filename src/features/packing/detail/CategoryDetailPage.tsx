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
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  BottomSheet,
  ErrorMessage,
  FloatingAddButton,
  LoadingSpinner,
} from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { useTripDetail } from "@/features/main/hooks/useTripDetail";

import PackingItemList from "./components/PackingItemList";
import { ItemForm, DeleteCategoryModal, SearchBar } from "./components";
import { useTripChecklist } from "../list/hooks/useTripChecklist";
import { useCreateItem } from "../list/hooks/useCreateItem";
import { useDeleteCategory } from "../list/hooks/useDeleteCategory";
import type { CategoryWithItems } from "../type";

export default function CategoryDetailPage() {
  const navigate = useNavigate();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
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

  const categoryParam = (search as { category?: string }).category || "";
  const { categories, isLoading, error } = useTripChecklist(tripId || "");
  const { trip } = useTripDetail(tripId || "");
  const createItemMutation = useCreateItem(tripId, {
    onSuccess: () => {
      onClose();
      setNewItemName("");
      setNewItemNotes("");
    },
  });
  const deleteCategoryMutation = useDeleteCategory(tripId);

  const countryCode = trip?.country_code;
  const categoryName = decodeURIComponent(categoryParam);
  const category = categories?.find(
    (cat: CategoryWithItems) => cat.name === categoryName,
  );
  const isEssentialCategory = category?.name === "필수 준비물";

  if (isLoading) {
    return (
      <LoadingSpinner
        message="체크리스트를 불러오고 있어요..."
        centered
        fullScreen
      />
    );
  }

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

  const handleDeleteCategory = () => {
    if (category?.id) {
      deleteCategoryMutation.mutate(category.id);
      onDeleteModalClose();
    }
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
              {!isEssentialCategory && (
                <IconButton
                  aria-label="카테고리 삭제"
                  size="sm"
                  variant="ghost"
                  color="red.500"
                  onClick={onDeleteModalOpen}
                >
                  <Trash2 size={18} />
                </IconButton>
              )}
            </HStack>
            <SearchBar onSearch={handleSearch} />
          </Box>

          <Box px={5} py={3}>
            <PackingItemList
              category={category}
              searchQuery={searchQuery}
              countryCode={countryCode}
            />
          </Box>
        </VStack>
      </Container>

      <FloatingAddButton onClick={handleAddItem} ariaLabel="새 아이템 추가" />

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
