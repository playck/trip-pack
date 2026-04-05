import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TablesInsert } from "@/shared/types/database.type";
import { toaster } from "@/shared/components/ui/toaster";
import {
  createChecklistTemplate,
  createTemplateCategoriesWithItems,
} from "./api";

interface CreateTemplateWithCategoriesParams {
  template: TablesInsert<"checklist_templates">;
  categories: {
    name: string;
    icon_key: string | null;
    display_order: number;
    category_type?: string;
    items: {
      name: string;
      notes: string | null;
      is_required: boolean | null;
      display_order: number;
      price?: number | null;
      quantity?: number | null;
    }[];
  }[];
}

export const useCreateChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      template,
      categories,
    }: CreateTemplateWithCategoriesParams) => {
      const newTemplate = await createChecklistTemplate(template);
      if (categories.length > 0) {
        await createTemplateCategoriesWithItems(newTemplate.id, categories);
      }
      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklistTemplates"],
      });
      toaster.create({
        title: "체크리스트을 저장했습니다",
        type: "success",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "체크리스트 저장에 실패했습니다",
        description: error.message,
        type: "error",
        duration: 2000,
      });
    },
  });
};
