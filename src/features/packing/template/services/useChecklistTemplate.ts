import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChecklistTemplate,
  deleteChecklistTemplate,
  getChecklistTemplate,
} from "./api";
import type { TablesInsert } from "@/shared/types/database.type";
import { toaster } from "@/shared/components/ui/toaster";

export const useChecklistTemplate = () => {
  return useQuery({
    queryKey: ["checklistTemplates"],
    queryFn: getChecklistTemplate,
  });
};

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

export const useDeleteChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChecklistTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklistTemplates"],
      });
      toaster.create({
        title: "체크리스트를 삭제했습니다",
        type: "success",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "체크리스트 삭제에 실패했습니다",
        description: error.message,
        type: "error",
        duration: 2000,
      });
    },
  });
};
