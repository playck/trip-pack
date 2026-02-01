import { useState } from "react";
import {
  VStack,
  Text,
  Center,
  Spinner,
  Box,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import PageLayout from "@/shared/components/layout/PageLayout";
import {
  FloatingAddButton,
  AddCategorySheet,
  ConfirmDialog,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components";
import { SearchBar } from "@/features/packing/detail/components";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { colors } from "@/shared/constants/colors";
import {
  TemplateCategoryGrid,
  TemplateItemList,
  TemplateInfoEditSheet,
  TemplateImportSheet,
} from "./components/my-checklists";
import { useTemplateEditor } from "./hooks";

export default function ChecklistDetailPage() {
  const { templateId } = useParams({
    from: "/mypage/my-checklists/$templateId",
  });
  const navigate = useNavigate();

  const {
    template,
    categories,
    selectedCategory,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    addCategory,
    deleteCategory,
    deleteCategories,
    importCategories,
    selectCategory,
    clearSelectedCategory,
    updateTemplateInfo,
  } = useTemplateEditor(templateId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isItemEditMode, setIsItemEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    open: isAddCategoryOpen,
    onOpen: onAddCategoryOpen,
    onClose: onAddCategoryClose,
  } = useDisclosure();
  const {
    open: isEditInfoOpen,
    onOpen: onEditInfoOpen,
    onClose: onEditInfoClose,
  } = useDisclosure();
  const {
    open: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();
  const {
    open: isDeleteCategoryOpen,
    onOpen: onDeleteCategoryOpen,
    onClose: onDeleteCategoryClose,
  } = useDisclosure();

  // 현재 뷰 상태 변수들
  const isCurrentEditMode = selectedCategory ? isItemEditMode : isEditMode;
  const hasContent = selectedCategory
    ? selectedCategory.items.length > 0
    : categories.length > 0;
  const shouldShowEditButton = isCurrentEditMode || hasContent;

  const handleSaveCategory = (name: string, iconKey: string) => {
    addCategory(name, iconKey);
    onAddCategoryClose();
  };

  const handleImportCategories = (importedCategories: typeof categories) => {
    importCategories(importedCategories);
    onImportClose();
  };

  const handleSaveTemplateInfo = (
    title: string,
    description: string | null,
  ) => {
    updateTemplateInfo(title, description);
    onEditInfoClose();
  };

  const handleBack = () => {
    if (selectedCategory) {
      setIsItemEditMode(false);
      setSearchQuery("");
      clearSelectedCategory();
    } else {
      navigate({ to: "/mypage/my-checklists" });
    }
  };

  const handleDeleteCurrentCategory = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      setSearchQuery("");
      clearSelectedCategory();
      onDeleteCategoryClose();
    }
  };

  const floatingMenuItems: FloatingMenuItem[] = [
    { label: "체크리스트 가져오기", onClick: onImportOpen },
    { label: "카테고리 추가", onClick: onAddCategoryOpen },
    { label: "템플릿 정보 수정", onClick: onEditInfoOpen },
  ];

  if (isLoading) {
    return (
      <PageLayout>
        <Center h="50vh">
          <Spinner color="teal.500" />
        </Center>
      </PageLayout>
    );
  }

  if (!template) {
    return (
      <PageLayout>
        <Center h="50vh">
          <VStack gap={2}>
            <Text color="gray.500">체크리스트를 찾을 수 없습니다.</Text>
          </VStack>
        </Center>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <VStack align="stretch" gap={0}>
        {/* 헤더 */}
        <Box
          py={selectedCategory ? 2 : 4}
          position={selectedCategory ? "sticky" : "relative"}
          top={selectedCategory ? `${HEADER_HEIGHT}px` : undefined}
          bg="white"
          zIndex={selectedCategory ? 100 : undefined}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Box as="button" p={1} color="gray.600" onClick={handleBack}>
              <ArrowLeft size={24} />
            </Box>
            <VStack align="flex-start" gap={0} flex={1}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {selectedCategory ? selectedCategory.name : template.title}
              </Text>
              {!selectedCategory && template.description && (
                <Text fontSize="sm" color="gray.500">
                  {template.description}
                </Text>
              )}
            </VStack>
            <HStack gap={1}>
              {/* 카테고리 삭제 버튼 - 아이템 목록일 때만 */}
              {selectedCategory && (
                <IconButton
                  aria-label="카테고리 삭제"
                  size="sm"
                  variant="ghost"
                  color="red.500"
                  onClick={onDeleteCategoryOpen}
                >
                  <Trash2 size={18} />
                </IconButton>
              )}
              {/* 편집 버튼 */}
              {shouldShowEditButton && (
                <Box
                  as="button"
                  px={3}
                  py={1.5}
                  bg={isCurrentEditMode ? colors.primary.palette : "gray.100"}
                  color={isCurrentEditMode ? "white" : "gray.600"}
                  fontWeight="medium"
                  fontSize="sm"
                  borderRadius="md"
                  onClick={() =>
                    selectedCategory
                      ? setIsItemEditMode(!isItemEditMode)
                      : setIsEditMode(!isEditMode)
                  }
                >
                  {isCurrentEditMode ? "완료" : "편집"}
                </Box>
              )}
            </HStack>
          </Box>

          {selectedCategory && <SearchBar onSearch={setSearchQuery} pt={2} />}
        </Box>

        {/* 컨텐츠 */}
        <Box pb={5}>
          {selectedCategory ? (
            <TemplateItemList
              items={selectedCategory.items}
              searchQuery={searchQuery}
              isEditMode={isItemEditMode}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onDeleteItems={deleteItems}
            />
          ) : (
            <TemplateCategoryGrid
              categories={categories}
              isEditMode={isEditMode}
              onCategoryClick={selectCategory}
              onDeleteCategories={deleteCategories}
            />
          )}
        </Box>
      </VStack>

      {!selectedCategory && !isEditMode && (
        <>
          <FloatingAddButton ariaLabel="메뉴" menuItems={floatingMenuItems} />

          {/* 카테고리 추가 바텀시트 */}
          <AddCategorySheet
            isOpen={isAddCategoryOpen}
            onSave={handleSaveCategory}
            onClose={onAddCategoryClose}
          />

          {/* 템플릿 정보 수정 바텀시트 */}
          <TemplateInfoEditSheet
            isOpen={isEditInfoOpen}
            title={template.title}
            description={template.description}
            onSave={handleSaveTemplateInfo}
            onClose={onEditInfoClose}
          />

          {/* 체크리스트 가져오기 바텀시트 */}
          <TemplateImportSheet
            isOpen={isImportOpen}
            currentTemplateId={templateId}
            existingCategoryNames={categories.map((c) => c.name)}
            onImport={handleImportCategories}
            onClose={onImportClose}
          />
        </>
      )}

      {/* 카테고리 삭제 확인 모달 */}
      <ConfirmDialog
        isOpen={isDeleteCategoryOpen}
        onClose={onDeleteCategoryClose}
        title="카테고리 삭제"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteCurrentCategory}
        isDangerous={true}
      >
        <Text>
          <Text as="span" fontWeight="bold" color="gray.800">
            '{selectedCategory?.name}'
          </Text>{" "}
          카테고리를 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            카테고리 안의 모든 아이템도 함께 삭제되며, 삭제된 데이터는 복구할 수
            없습니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </PageLayout>
  );
}
