import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";
import type { PackItem } from "@/shared/data/checkList";

export type CategoryItem = string | PackItem;

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
