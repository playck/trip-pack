import { supabase } from "@/shared/service/supabase/cilent";
import type { TablesInsert } from "@/shared/types/database.type";

export const getChecklistTemplate = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`인증 오류: ${authError.message}`);
  }

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("checklist_templates")
    .select("*, template_categories(*, template_items(*))")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`체크리스트 템플릿 조회 실패: ${error.message}`);
  }

  return data;
};

export const createChecklistTemplate = async (
  template: TablesInsert<"checklist_templates">
) => {
  const { data, error } = await supabase
    .from("checklist_templates")
    .insert(template)
    .select("id")
    .single();

  if (error) {
    throw new Error(`체크리스트 템플릿 생성 실패: ${error.message}`);
  }

  return data;
};

export const deleteChecklistTemplate = async (id: string) => {
  const { error } = await supabase
    .from("checklist_templates")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`체크리스트 템플릿 삭제 실패: ${error.message}`);
  }
};

export interface UpdateChecklistTemplateParams {
  id: string;
  title?: string;
  description?: string | null;
}

export const updateChecklistTemplate = async ({
  id,
  title,
  description,
}: UpdateChecklistTemplateParams) => {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) {
    updateData.title = title;
  }
  if (description !== undefined) {
    updateData.description = description;
  }

  const { error } = await supabase
    .from("checklist_templates")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(`체크리스트 템플릿 업데이트 실패: ${error.message}`);
  }
};

// 템플릿 카테고리 추가
export const addTemplateCategory = async (
  templateId: string,
  name: string,
  iconKey: string,
  displayOrder: number
) => {
  const { data, error } = await supabase
    .from("template_categories")
    .insert({
      template_id: templateId,
      name,
      icon_key: iconKey,
      display_order: displayOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`카테고리 추가 실패: ${error.message}`);
  }

  return data;
};

// 템플릿 카테고리 삭제
export const deleteTemplateCategories = async (categoryIds: string[]) => {
  const { error } = await supabase
    .from("template_categories")
    .delete()
    .in("id", categoryIds);

  if (error) {
    throw new Error(`카테고리 삭제 실패: ${error.message}`);
  }
};

// 템플릿 아이템 추가
export const addTemplateItem = async (
  categoryId: string,
  name: string,
  notes?: string,
  displayOrder?: number
) => {
  const { data, error } = await supabase
    .from("template_items")
    .insert({
      category_id: categoryId,
      name,
      notes: notes || null,
      display_order: displayOrder ?? 0,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`아이템 추가 실패: ${error.message}`);
  }

  return data;
};

// 템플릿 아이템 수정
export const updateTemplateItem = async (
  itemId: string,
  name: string,
  notes?: string
) => {
  const { error } = await supabase
    .from("template_items")
    .update({ name, notes: notes || null })
    .eq("id", itemId);

  if (error) {
    throw new Error(`아이템 수정 실패: ${error.message}`);
  }
};

// 템플릿 아이템 삭제
export const deleteTemplateItem = async (itemId: string) => {
  const { error } = await supabase
    .from("template_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw new Error(`아이템 삭제 실패: ${error.message}`);
  }
};

// 템플릿 아이템 삭제
export const deleteTemplateItems = async (itemIds: string[]) => {
  const { error } = await supabase
    .from("template_items")
    .delete()
    .in("id", itemIds);

  if (error) {
    throw new Error(`아이템 삭제 실패: ${error.message}`);
  }
};

// 템플릿 카테고리 및 아이템 생성

interface BulkCategoryInput {
  name: string;
  icon_key: string | null;
  display_order: number;
  items: {
    name: string;
    notes: string | null;
    is_required: boolean | null;
    display_order: number;
  }[];
}

export const createTemplateCategoriesWithItems = async (
  templateId: string,
  categories: BulkCategoryInput[]
) => {
  for (const cat of categories) {
    const { data: newCat, error: catError } = await supabase
      .from("template_categories")
      .insert({
        template_id: templateId,
        name: cat.name,
        icon_key: cat.icon_key,
        display_order: cat.display_order,
      })
      .select("id")
      .single();

    if (catError) {
      throw new Error(`카테고리 생성 실패: ${catError.message}`);
    }

    if (cat.items.length > 0) {
      const itemsToInsert = cat.items.map((item) => ({
        category_id: newCat.id,
        name: item.name,
        notes: item.notes,
        is_required: item.is_required ?? false,
        display_order: item.display_order,
      }));

      const { error: itemsError } = await supabase
        .from("template_items")
        .insert(itemsToInsert);

      if (itemsError) {
        throw new Error(`아이템 생성 실패: ${itemsError.message}`);
      }
    }
  }
};

// 템플릿 카테고리 가져오기
export const getTemplateCategories = async (
  templateId: string,
  sourceCategories: {
    name: string;
    icon_key: string | null;
    template_items: {
      name: string;
      notes: string | null;
      is_required: boolean | null;
      display_order: number | null;
    }[];
  }[],
  startOrder: number
) => {
  for (let i = 0; i < sourceCategories.length; i++) {
    const cat = sourceCategories[i];

    const { data: newCat, error: catError } = await supabase
      .from("template_categories")
      .insert({
        template_id: templateId,
        name: cat.name,
        icon_key: cat.icon_key,
        display_order: startOrder + i,
      })
      .select("id")
      .single();

    if (catError) {
      throw new Error(`카테고리 가져오기 실패: ${catError.message}`);
    }

    if (cat.template_items.length > 0) {
      const itemsToInsert = cat.template_items.map((item) => ({
        category_id: newCat.id,
        name: item.name,
        notes: item.notes,
        is_required: item.is_required ?? false,
        display_order: item.display_order ?? 0,
      }));

      const { error: itemsError } = await supabase
        .from("template_items")
        .insert(itemsToInsert);

      if (itemsError) {
        throw new Error(`아이템 가져오기 실패: ${itemsError.message}`);
      }
    }
  }
};
