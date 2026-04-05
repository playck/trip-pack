import { VStack, Text, Center, Spinner } from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useTemplateEditor } from "./hooks";
import ChecklistCategoryView from "./components/ChecklistCategoryView";
import ChecklistItemView from "./components/ChecklistItemView";

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
        {selectedCategory ? (
          <ChecklistItemView
            category={selectedCategory}
            categoryType={selectedCategory.category_type}
            onBack={clearSelectedCategory}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onDeleteItems={deleteItems}
            onDeleteCategory={(categoryId) => {
              deleteCategory(categoryId);
              clearSelectedCategory();
            }}
          />
        ) : (
          <ChecklistCategoryView
            title={template.title}
            description={template.description}
            categories={categories}
            currentTemplateId={templateId}
            onBack={() => navigate({ to: "/mypage/my-checklists" })}
            onCategoryClick={selectCategory}
            onAddCategory={addCategory}
            onDeleteCategories={deleteCategories}
            onImportCategories={importCategories}
            onUpdateInfo={updateTemplateInfo}
          />
        )}
      </VStack>
    </PageLayout>
  );
}
