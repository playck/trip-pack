import { useState } from "react";
import { Box, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { FloatingAddButton, AddCategorySheet } from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import type { CategoryWithItems } from "@/features/packing/type";
import {
  TemplateCategoryGrid,
  TemplateInfoEditSheet,
  TemplateImportSheet,
} from "./my-checklists";

interface ChecklistCategoryViewProps {
  title: string;
  description: string | null;
  categories: CategoryWithItems[];
  currentTemplateId: string;
  onBack: () => void;
  onCategoryClick: (category: CategoryWithItems) => void;
  onAddCategory: (name: string, iconKey: string) => void;
  onDeleteCategories: (categoryIds: string[]) => void;
  onImportCategories: (categories: CategoryWithItems[]) => void;
  onUpdateInfo: (title: string, description: string | null) => void;
}

export default function ChecklistCategoryView({
  title,
  description,
  categories,
  currentTemplateId,
  onBack,
  onCategoryClick,
  onAddCategory,
  onDeleteCategories,
  onImportCategories,
  onUpdateInfo,
}: ChecklistCategoryViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);
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

  const hasContent = categories.length > 0;

  const handleSaveCategory = (name: string, iconKey: string) => {
    onAddCategory(name, iconKey);
    onAddCategoryClose();
  };

  const handleImportCategories = (imported: CategoryWithItems[]) => {
    onImportCategories(imported);
    onImportClose();
  };

  const handleSaveInfo = (newTitle: string, newDescription: string | null) => {
    onUpdateInfo(newTitle, newDescription);
    onEditInfoClose();
  };

  const floatingMenuItems: FloatingMenuItem[] = [
    { label: "체크리스트 가져오기", onClick: onImportOpen },
    { label: "카테고리 추가", onClick: onAddCategoryOpen },
    { label: "템플릿 정보 수정", onClick: onEditInfoOpen },
  ];

  return (
    <>
      {/* 헤더 */}
      <Box py={4}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box as="button" p={1} color="gray.600" onClick={onBack}>
            <ArrowLeft size={24} />
          </Box>
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {title}
            </Text>
            {description && (
              <Text fontSize="sm" color="gray.500">
                {description}
              </Text>
            )}
          </VStack>
          <HStack gap={1}>
            {(isEditMode || hasContent) && (
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
      </Box>

      {/* 카테고리 그리드 */}
      <Box pb={5}>
        <TemplateCategoryGrid
          categories={categories}
          isEditMode={isEditMode}
          onCategoryClick={onCategoryClick}
          onDeleteCategories={onDeleteCategories}
        />
      </Box>

      {/* 플로팅 메뉴 & 바텀시트 */}
      {!isEditMode && (
        <>
          <FloatingAddButton ariaLabel="메뉴" menuItems={floatingMenuItems} />

          <AddCategorySheet
            isOpen={isAddCategoryOpen}
            onSave={handleSaveCategory}
            onClose={onAddCategoryClose}
          />

          <TemplateInfoEditSheet
            isOpen={isEditInfoOpen}
            title={title}
            description={description}
            onSave={handleSaveInfo}
            onClose={onEditInfoClose}
          />

          <TemplateImportSheet
            isOpen={isImportOpen}
            currentTemplateId={currentTemplateId}
            existingCategoryNames={categories.map((c) => c.name)}
            onImport={handleImportCategories}
            onClose={onImportClose}
          />
        </>
      )}
    </>
  );
}
