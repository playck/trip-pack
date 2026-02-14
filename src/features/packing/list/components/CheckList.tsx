import type { CategoryWithItems } from "@/features/packing/type";
import { SelectableCategoryGrid } from "@/shared/components";

interface CheckListProps {
  categories: CategoryWithItems[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

export default function CheckList({
  categories,
  selectedIds,
  onSelectionChange,
}: CheckListProps) {
  const handleToggle = (categoryId: string) => {
    const next = new Set(selectedIds);
    if (next.has(categoryId)) {
      next.delete(categoryId);
    } else {
      next.add(categoryId);
    }
    onSelectionChange(next);
  };

  return (
    <SelectableCategoryGrid
      categories={categories}
      selectedIds={selectedIds}
      onToggle={handleToggle}
      subText={(c) => `${c.items.length}개 아이템`}
    />
  );
}
