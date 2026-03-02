import { SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";

import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import type { TodoCategoryWithItems } from "../../type";
import TodoCategoryBox from "./TodoCategoryBox";

interface TodoGridViewProps {
  categories: TodoCategoryWithItems[];
  tripId: string;
}

export default function TodoGridView({
  categories,
  tripId,
}: TodoGridViewProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        const icon = category.icon_key
          ? CATEGORY_ICONS[category.icon_key] || Package
          : Package;

        return (
          <TodoCategoryBox
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
