import { useState } from "react";
import { Box, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import {
  ArrowLeft,
  FolderPlus,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { FloatingAddButton, AddCategorySheet } from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import type { TemplateCategoryWithItems } from "@/features/packing/type";
import {
  TemplateCategoryGrid,
  TemplateInfoEditSheet,
  TemplateImportSheet,
} from "./my-checklists";

interface ChecklistCategoryViewProps {
  title: string;
  description: string | null;
  categories: TemplateCategoryWithItems[];
  currentTemplateId: string;
  onBack: () => void;
  onCategoryClick: (category: TemplateCategoryWithItems) => void;
  onAddCategory: (name: string, iconKey: string, categoryType?: string) => void;
  onDeleteCategories: (categoryIds: string[]) => void;
  onImportCategories: (categories: TemplateCategoryWithItems[]) => void;
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
    open: isAddShoppingCategoryOpen,
    onOpen: onAddShoppingCategoryOpen,
    onClose: onAddShoppingCategoryClose,
  } = useDisclosure();
  const {
    open: isAddTodoCategoryOpen,
    onOpen: onAddTodoCategoryOpen,
    onClose: onAddTodoCategoryClose,
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
    onAddCategory(name, iconKey, "packing");
    onAddCategoryClose();
  };

  const handleSaveShoppingCategory = (name: string, iconKey: string) => {
    onAddCategory(name, iconKey, "shopping");
    onAddShoppingCategoryClose();
  };

  const handleSaveTodoCategory = (name: string, iconKey: string) => {
    onAddCategory(name, iconKey, "todo");
    onAddTodoCategoryClose();
  };

  const handleImportCategories = (imported: TemplateCategoryWithItems[]) => {
    onImportCategories(imported);
    onImportClose();
  };

  const handleSaveInfo = (newTitle: string, newDescription: string | null) => {
    onUpdateInfo(newTitle, newDescription);
    onEditInfoClose();
  };

  const floatingMenuItems: FloatingMenuItem[] = [
    { label: "체크리스트 가져오기", onClick: onImportOpen },
    {
      label: "준비물",
      icon: <FolderPlus size={18} />,
      onClick: onAddCategoryOpen,
      group: "category",
      groupLabel: "카테고리 추가",
    },
    {
      label: "쇼핑",
      icon: <ShoppingCart size={18} />,
      onClick: onAddShoppingCategoryOpen,
      group: "category",
    },
    {
      label: "할일",
      icon: <ClipboardList size={18} />,
      onClick: onAddTodoCategoryOpen,
      group: "category",
    },
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
            title="새 준비물 카테고리 추가"
            onSave={handleSaveCategory}
            onClose={onAddCategoryClose}
          />

          <AddCategorySheet
            isOpen={isAddShoppingCategoryOpen}
            title="새 쇼핑 카테고리 추가"
            onSave={handleSaveShoppingCategory}
            onClose={onAddShoppingCategoryClose}
          />

          <AddCategorySheet
            isOpen={isAddTodoCategoryOpen}
            title="새 할일 카테고리 추가"
            onSave={handleSaveTodoCategory}
            onClose={onAddTodoCategoryClose}
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
