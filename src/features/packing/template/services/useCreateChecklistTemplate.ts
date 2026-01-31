import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklistTemplate } from "./api";
import type { TablesInsert } from "@/shared/types/database.type";
import { toaster } from "@/shared/components/ui/toaster";

export const useCreateChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: TablesInsert<"checklist_templates">) =>
      createChecklistTemplate(template),
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
