import { useState } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/shared/components";
import { SearchBar } from "@/features/packing/detail/components";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { colors } from "@/shared/constants/colors";
import type { TemplateCategoryWithItems } from "@/features/packing/type";
import { TemplateItemList } from "./my-checklists";

interface ChecklistItemViewProps {
  category: TemplateCategoryWithItems;
  categoryType?: string;
  onBack: () => void;
  onAddItem: (name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onUpdateItem: (itemId: string, name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteItems: (itemIds: string[]) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function ChecklistItemView({
  category,
  categoryType,
  onBack,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDeleteItems,
  onDeleteCategory,
}: ChecklistItemViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const hasItems = category.template_items.length > 0;

  const handleBack = () => {
    setIsEditMode(false);
    setSearchQuery("");
    onBack();
  };

  const handleDeleteCategory = () => {
    onDeleteCategory(category.id);
    onDeleteClose();
  };

  return (
    <>
      {/* 헤더 */}
      <Box
        py={2}
        position="sticky"
        top={`${HEADER_HEIGHT}px`}
        bg="white"
        zIndex={100}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Box as="button" p={1} color="gray.600" onClick={handleBack}>
            <ArrowLeft size={24} />
          </Box>
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {category.name}
            </Text>
          </VStack>
          <HStack gap={1}>
            <IconButton
              aria-label="카테고리 삭제"
              size="sm"
              variant="ghost"
              color="red.500"
              onClick={onDeleteOpen}
            >
              <Trash2 size={18} />
            </IconButton>
            {(isEditMode || hasItems) && (
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
        </Box>
        <SearchBar onSearch={setSearchQuery} pt={2} />
      </Box>

      {/* 아이템 리스트 */}
      <Box pb={5}>
        <TemplateItemList
          items={category.template_items}
          categoryType={categoryType}
          searchQuery={searchQuery}
          isEditMode={isEditMode}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onDeleteItems={onDeleteItems}
        />
      </Box>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="카테고리 삭제"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteCategory}
        isDangerous={true}
      >
        <Text>
          <Text as="span" fontWeight="bold" color="gray.800">
            '{category.name}'
          </Text>{" "}
          카테고리를 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            카테고리 안의 모든 아이템도 함께 삭제되며, 삭제된 데이터는 복구할 수
            없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </>
  );
}
