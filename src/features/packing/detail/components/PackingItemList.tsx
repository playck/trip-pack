import { VStack } from "@chakra-ui/react";
import { useMemo } from "react";

import PackingItem from "./PackingItem";
import type { CategoryWithItems } from "../../type";

interface PackingItemListProps {
  category: CategoryWithItems;
}

export default function PackingItemList({ category }: PackingItemListProps) {
  const sortedItems = useMemo(() => {
    return [...category.items].sort((itemA, itemB) => {
      const checkedA = itemA.is_checked || false;
      const checkedB = itemB.is_checked || false;

      if (checkedA === checkedB) return 0;
      return checkedA ? 1 : -1;
    });
  }, [category.items]);

  return (
    <VStack gap={3} align="stretch">
      {sortedItems.map((item, idx) => (
        <PackingItem
          key={item.id || `${item.name}-${idx}`}
          item={item}
          // categoryName={category.name}
        />
      ))}
    </VStack>
  );
}
