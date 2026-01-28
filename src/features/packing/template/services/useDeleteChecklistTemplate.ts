import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChecklistTemplate } from "./api";
import { toaster } from "@/shared/components/ui/toaster";

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
