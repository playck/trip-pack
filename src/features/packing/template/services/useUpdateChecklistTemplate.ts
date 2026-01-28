import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChecklistTemplate, type UpdateChecklistTemplateParams } from "./api";
import { toaster } from "@/shared/components/ui/toaster";

export const useUpdateChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateChecklistTemplateParams) =>
      updateChecklistTemplate(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklistTemplates"],
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "저장에 실패했습니다",
        description: error.message,
        type: "error",
        duration: 2000,
      });
    },
  });
};
