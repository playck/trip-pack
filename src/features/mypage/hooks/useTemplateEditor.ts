import { useMemo, useState, useCallback } from "react";
import {
  useChecklistTemplates,
  useUpdateChecklistTemplate,
} from "@/features/packing/template/services";
import type { CategoryWithItems, ChecklistItem } from "@/features/packing/type";
import type { Json } from "@/shared/types/database.type";
import { generateId } from "@/shared/utils/generateId";

const parseCategoryData = (data: unknown): CategoryWithItems[] => {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is CategoryWithItems =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "name" in item &&
      "items" in item &&
      Array.isArray(item.items),
  );
};

export const useTemplateEditor = (templateId: string) => {
  const { data: templates, isLoading } = useChecklistTemplates();
  const updateTemplateMutation = useUpdateChecklistTemplate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const template = useMemo(() => {
    return templates?.find((t) => t.id === templateId);
  }, [templates, templateId]);

  const categories = useMemo(() => {
    if (!template?.checklist_data) return [];
    return parseCategoryData(template.checklist_data);
  }, [template]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // 카테고리 데이터 업데이트 헬퍼
  const updateCategories = useCallback(
    (newCategories: CategoryWithItems[]) => {
      if (!templateId) return;
      updateTemplateMutation.mutate({
        id: templateId,
        checklist_data: newCategories as unknown as Json,
      });
    },
    [templateId, updateTemplateMutation],
  );

  // ===== 아이템 CRUD =====

  const addItem = useCallback(
    (name: string, notes?: string) => {
      if (!selectedCategoryId) return;

      const newItem: ChecklistItem = {
        id: generateId("item"),
        name,
        notes: notes || null,
        is_checked: false,
        category_id: selectedCategoryId,
        display_order: selectedCategory?.items.length || 0,
        cabin_notes: null,
        cabin_policy: null,
        created_at: new Date().toISOString(),
        is_required: false,
        updated_at: new Date().toISOString(),
      };

      const newCategories = categories.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, items: [...cat.items, newItem] }
          : cat,
      );

      updateCategories(newCategories);
    },
    [selectedCategoryId, selectedCategory, categories, updateCategories],
  );

  const updateItem = useCallback(
    (itemId: string, name: string, notes?: string) => {
      if (!selectedCategoryId) return;

      const newCategories = categories.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? { ...item, name, notes: notes || null }
                  : item,
              ),
            }
          : cat,
      );

      updateCategories(newCategories);
    },
    [selectedCategoryId, categories, updateCategories],
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      if (!selectedCategoryId) return;

      const newCategories = categories.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat,
      );

      updateCategories(newCategories);
    },
    [selectedCategoryId, categories, updateCategories],
  );

  const deleteItems = useCallback(
    (itemIds: string[]) => {
      if (!selectedCategoryId) return;

      const newCategories = categories.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              items: cat.items.filter((item) => !itemIds.includes(item.id)),
            }
          : cat,
      );

      updateCategories(newCategories);
    },
    [selectedCategoryId, categories, updateCategories],
  );

  // ===== 카테고리 CRUD =====

  const addCategory = useCallback(
    (name: string, iconKey: string) => {
      const newCategory: CategoryWithItems = {
        id: generateId("cat"),
        name,
        icon_key: iconKey,
        items: [],
        trip_id: null,
        created_at: new Date().toISOString(),
        display_order: categories.length,
      };

      updateCategories([...categories, newCategory]);
    },
    [categories, updateCategories],
  );

  const deleteCategory = useCallback(
    (categoryId: string) => {
      const newCategories = categories.filter((cat) => cat.id !== categoryId);
      updateCategories(newCategories);
    },
    [categories, updateCategories],
  );

  const importCategories = useCallback(
    (importedCategories: CategoryWithItems[]) => {
      const newCategories = importedCategories.map((cat, idx) => ({
        ...cat,
        id: generateId("cat"),
        display_order: categories.length + idx,
        items: cat.items.map((item) => ({
          ...item,
          id: generateId("item"),
          is_checked: false,
        })),
      }));

      updateCategories([...categories, ...newCategories]);
    },
    [categories, updateCategories],
  );

  const selectCategory = useCallback((category: CategoryWithItems | null) => {
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
    addItem,
    updateItem,
    deleteItem,
    deleteItems,

    // 카테고리 CRUD
    addCategory,
    deleteCategory,
    importCategories,
    selectCategory,
    clearSelectedCategory,

    // 템플릿 정보
    updateTemplateInfo,
  };
};
