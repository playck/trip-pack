import { useAuth } from "@/shared/hooks/useAuth";
import type { TripInfo } from "@/shared/service/trip/tripInfo";
import { useCreateChecklistTemplate } from "@/features/packing/template/services";

interface SaveableCategory {
  name: string;
  icon_key: string | null;
  category_type?: string;
  items: { name: string; notes: string | null; is_required?: boolean | null; price?: number | null; quantity?: number | null }[];
}

export const useSaveAsTemplate = () => {
  const createTemplateMutation = useCreateChecklistTemplate();
  const { user } = useAuth();

  const handleSaveAsTemplate = (
    tripInfo: TripInfo | null | undefined,
    categories: SaveableCategory[],
    customTitle?: string,
  ) => {
    if (!tripInfo || !user) return;

    const templateTitle = customTitle || `${tripInfo.title} 체크리스트`;
    const templateDescription = tripInfo.startDate
      ? `${tripInfo.startDate}${tripInfo.endDate ? ` ~ ${tripInfo.endDate}` : ""}`
      : null;

    const templateCategories = categories.map((cat, idx) => ({
      name: cat.name,
      icon_key: cat.icon_key,
      display_order: idx,
      category_type: cat.category_type ?? "packing",
      items: cat.items.map((item, itemIdx) => ({
        name: item.name,
        notes: item.notes,
        is_required: item.is_required ?? null,
        display_order: itemIdx,
        price: item.price ?? null,
        quantity: item.quantity ?? null,
      })),
    }));

    createTemplateMutation.mutate({
      template: {
        title: templateTitle,
        description: templateDescription,
        is_public: false,
        user_id: user.id,
      },
      categories: templateCategories,
    });
  };

  return {
    handleSaveAsTemplate,
    isLoading: createTemplateMutation.isPending,
    isSuccess: createTemplateMutation.isSuccess,
    error: createTemplateMutation.error,
  };
};
