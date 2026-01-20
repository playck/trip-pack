import { useAuth } from "@/shared/hooks/useAuth";
import type { TripInfo } from "@/shared/service/trip/tripInfo";
import { useCreateChecklistTemplate } from "@/features/packing/template/services/useChecklistTemplate";
import type { CategoryWithItems } from "../../type";

export const useSaveAsTemplate = () => {
  const createTemplateMutation = useCreateChecklistTemplate();
  const { user } = useAuth();

  const handleSaveAsTemplate = (
    tripInfo: TripInfo | null | undefined,
    categories: CategoryWithItems[],
    customTitle?: string
  ) => {
    if (!tripInfo || !user) return;

    const templateTitle = customTitle || `${tripInfo.title} 체크리스트`;
    const templateDescription = tripInfo.startDate
      ? `${tripInfo.startDate}${tripInfo.endDate ? ` ~ ${tripInfo.endDate}` : ""}`
      : null;

    createTemplateMutation.mutate({
      title: templateTitle,
      description: templateDescription,
      checklist_data: JSON.parse(JSON.stringify(categories)),
      is_public: false,
      user_id: user.id,
    });
  };

  return {
    handleSaveAsTemplate,
    isLoading: createTemplateMutation.isPending,
    isSuccess: createTemplateMutation.isSuccess,
    error: createTemplateMutation.error,
  };
};
