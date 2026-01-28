import { useQuery } from "@tanstack/react-query";
import { getChecklistTemplate } from "./api";

export const useChecklistTemplates = () => {
  return useQuery({
    queryKey: ["checklistTemplates"],
    queryFn: getChecklistTemplate,
  });
};
