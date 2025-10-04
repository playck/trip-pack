import { useCreateChecklistTemplate } from "@/features/packing/template/services/useChecklistTemplate";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TripInfo } from "@/shared/service/tripInfo";
import type { CategoryWithItems } from "../../type";

export const useSaveAsTemplate = () => {
  const createTemplateMutation = useCreateChecklistTemplate();
  const { user } = useAuth();

  const handleSaveAsTemplate = (
    tripInfo: TripInfo | null | undefined,
    categories: CategoryWithItems[]
  ) => {
    if (!tripInfo || !user) return;

    const templateTitle = `${tripInfo.title} 체크리스트`;
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
