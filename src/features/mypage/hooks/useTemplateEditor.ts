import { useMemo, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useChecklistTemplates,
  useUpdateChecklistTemplate,
} from "@/features/packing/template/services";
import {
  addTemplateCategory,
  addTemplateItem,
  updateTemplateItem,
  deleteTemplateItem,
  deleteTemplateItems,
  deleteTemplateCategories,
  getTemplateCategories,
} from "@/features/packing/template/services/api";
import type { TemplateCategoryWithItems } from "@/features/packing/type";

export const useTemplateEditor = (templateId: string) => {
  const { data: templates, isLoading } = useChecklistTemplates();
  const updateTemplateMutation = useUpdateChecklistTemplate();
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const template = useMemo(() => {
    return templates?.find((t) => t.id === templateId);
  }, [templates, templateId]);

  const categories = useMemo((): TemplateCategoryWithItems[] => {
    if (!template?.template_categories) return [];
    return [...template.template_categories].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    );
  }, [template]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["checklistTemplates"] });
  }, [queryClient]);

  // ===== 아이템 CRUD =====

  const handleAddItem = useCallback(
    async (name: string, notes?: string, extra?: { price?: number; quantity?: number }) => {
      if (!selectedCategoryId) return;
      const itemCount = selectedCategory?.template_items.length || 0;
      await addTemplateItem(selectedCategoryId, name, notes, itemCount, extra);
      invalidate();
    },
    [selectedCategoryId, selectedCategory, invalidate],
  );

  const handleUpdateItem = useCallback(
    async (itemId: string, name: string, notes?: string, extra?: { price?: number; quantity?: number }) => {
      await updateTemplateItem(itemId, name, notes, extra);
      invalidate();
    },
    [invalidate],
  );

  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      await deleteTemplateItem(itemId);
      invalidate();
    },
    [invalidate],
  );

  const handleDeleteItems = useCallback(
    async (itemIds: string[]) => {
      await deleteTemplateItems(itemIds);
      invalidate();
    },
    [invalidate],
  );

  // ===== 카테고리 CRUD =====

  const handleAddCategory = useCallback(
    async (name: string, iconKey: string, categoryType: string = "packing") => {
      await addTemplateCategory(templateId, name, iconKey, categories.length, categoryType);
      invalidate();
    },
    [templateId, categories.length, invalidate],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      await deleteTemplateCategories([categoryId]);
      invalidate();
    },
    [invalidate],
  );

  const handleDeleteCategories = useCallback(
    async (categoryIds: string[]) => {
      await deleteTemplateCategories(categoryIds);
      invalidate();
    },
    [invalidate],
  );

  const handleImportCategories = useCallback(
    async (importedCategories: TemplateCategoryWithItems[]) => {
      await getTemplateCategories(
        templateId,
        importedCategories,
        categories.length,
      );
      invalidate();
    },
    [templateId, categories.length, invalidate],
  );

  const selectCategory = useCallback((category: TemplateCategoryWithItems | null) => {
    setSelectedCategoryId(category?.id || null);
  }, []);

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  // ===== 템플릿 정보 =====

  const updateTemplateInfo = useCallback(
    (title: string, description: string | null) => {
      if (!templateId) return;
      updateTemplateMutation.mutate({
        id: templateId,
        title,
        description,
      });
    },
    [templateId, updateTemplateMutation],
  );

  return {
    // 상태
    template,
    categories,
    selectedCategory,
    isLoading,

    // 아이템 CRUD
    addItem: handleAddItem,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    deleteItems: handleDeleteItems,

    // 카테고리 CRUD
    addCategory: handleAddCategory,
    deleteCategory: handleDeleteCategory,
    deleteCategories: handleDeleteCategories,
    importCategories: handleImportCategories,
    selectCategory,
    clearSelectedCategory,

    // 템플릿 정보
    updateTemplateInfo,
  };
};
