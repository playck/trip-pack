import { SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";

import CategoryBox from "./CategoryBox";
import { CATEGORY_ICONS } from "../constants/category";
import type { CategoryWithItems } from "../../type";

interface GridViewProps {
  categories: CategoryWithItems[];
}

export default function GridView({ categories }: GridViewProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        // 카테고리 이름으로 아이콘 매핑
        const icon = CATEGORY_ICONS[category.name] || Package;

        return (
          <CategoryBox key={category.id} category={category} icon={icon} />
        );
      })}
    </SimpleGrid>
  );
}
