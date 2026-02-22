import { SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";

import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import type { ShoppingCategoryWithItems } from "../../type";
import ShoppingCategoryBox from "./ShoppingCategoryBox";

interface ShoppingGridViewProps {
  categories: ShoppingCategoryWithItems[];
  tripId: string;
}

export default function ShoppingGridView({
  categories,
  tripId,
}: ShoppingGridViewProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        const icon = category.icon_key
          ? CATEGORY_ICONS[category.icon_key] || Package
          : Package;

        return (
          <ShoppingCategoryBox
            key={category.id}
            category={category}
            icon={icon}
            tripId={tripId}
          />
        );
      })}
    </SimpleGrid>
  );
}
