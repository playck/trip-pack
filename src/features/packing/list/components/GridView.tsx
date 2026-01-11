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
    <SimpleGrid columns={3} gap={4} w="full" pb="60px">
      {categories.map((category) => {
        const icon = category.icon_key
          ? CATEGORY_ICONS[category.icon_key] || Package
          : CATEGORY_ICONS[category.name] || Package;

        return (
          <CategoryBox key={category.id} category={category} icon={icon} />
        );
      })}
    </SimpleGrid>
  );
}
