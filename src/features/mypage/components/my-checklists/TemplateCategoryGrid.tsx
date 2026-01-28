import { SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import type { CategoryWithItems } from "@/features/packing/type";
import TemplateCategoryBox from "./TemplateCategoryBox";

interface TemplateCategoryGridProps {
  categories: CategoryWithItems[];
  isEditMode?: boolean;
  onCategoryClick: (category: CategoryWithItems) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function TemplateCategoryGrid({
  categories,
  isEditMode = false,
  onCategoryClick,
  onDeleteCategory,
}: TemplateCategoryGridProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full" pb="80px">
      {categories.map((category) => {
        const icon = category.icon_key
          ? CATEGORY_ICONS[category.icon_key] || Package
          : CATEGORY_ICONS[category.name] || Package;

        return (
          <TemplateCategoryBox
            key={category.id}
            category={category}
            icon={icon}
            isEditMode={isEditMode}
            onClick={() => onCategoryClick(category)}
            onDelete={() => onDeleteCategory(category.id)}
          />
        );
      })}
    </SimpleGrid>
  );
}
