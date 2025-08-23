import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";

export type CategoryItem =
  | string
  | { name: string; required?: boolean; notes?: string };

export type CustomCategory = {
  categoryName: string;
  iconKey: string;
  items: CategoryItem[];
};

export type CombinedCategory = GeneratedCheckList | CustomCategory;

export const isGeneratedCheckList = (
  category: CombinedCategory
): category is GeneratedCheckList => {
  return !("iconKey" in category);
};

export const getItemName = (item: CategoryItem): string => {
  return typeof item === "string" ? item : item.name;
};
