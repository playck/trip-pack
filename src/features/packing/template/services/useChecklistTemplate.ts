import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChecklistTemplate, getChecklistTemplate } from "./api";
import type { TablesInsert } from "@/shared/types/database.type";
import { toaster } from "@/shared/components/ui/toaster";

export const useChecklistTemplate = () => {
  return useQuery({
    queryKey: ["checklistTemplates"],
    queryFn: getChecklistTemplate,
  });
};

export const useCreateChecklistTemplate = (
  template: TablesInsert<"checklist_templates">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createChecklistTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklistTemplates"],
      });
      toaster.create({
        title: "체크리스트 템플릿 생성 성공",
        type: "success",
        duration: 1500,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "체크리스트 템플릿 생성 실패",
        description: error.message,
        type: "error",
        duration: 2500,
      });
    },
  });
};
