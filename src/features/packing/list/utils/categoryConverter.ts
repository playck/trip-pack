import type { PackItem, CabinPolicy } from "@/shared/data/checkList";
import type { CategoryWithItems } from "../../type";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";

export const convertCategoryWithItemsToCheckList = (
  categories: CategoryWithItems[]
): GeneratedCheckList[] => {
  return categories.map((category) => ({
    categoryName: category.name,
    items: category.items.map(
      (item): PackItem => ({
        name: item.name,
        required: item.is_required || false,
        notes: item.notes || undefined,
        cabinNotes: item.cabin_notes || undefined,
        cabin: item.cabin_policy as CabinPolicy,
        checked: item.is_checked || false,
      })
    ),
  }));
};
