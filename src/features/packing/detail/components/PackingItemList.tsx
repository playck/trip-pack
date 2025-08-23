import { VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import PackingItem from "./PackingItem";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";
import {
  categoryItemsAtom,
  checkedItemsAtom,
} from "../../list/store/checklistAtom";

interface PackingItemListProps {
  category: GeneratedCheckList;
}

export default function PackingItemList({ category }: PackingItemListProps) {
  const categoryItems = useAtomValue(categoryItemsAtom);
  const checkedItems = useAtomValue(checkedItemsAtom);
  const currentCategory = categoryItems[category.categoryName] || category;

  const sortedItems = useMemo(() => {
    const isItemChecked = (itemName: string) => {
      const key = `${category.categoryName}-${itemName}`;
      return !!checkedItems[key];
    };

    return [...currentCategory.items].sort((itemA, itemB) => {
      const checkedA = isItemChecked(itemA.name);
      const checkedB = isItemChecked(itemB.name);

      if (checkedA === checkedB) return 0;
      return checkedA ? 1 : -1;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory.items, category.categoryName]);

  return (
    <VStack gap={3} align="stretch">
      {sortedItems.map((item, idx) => (
        <PackingItem
          key={`${item.name}-${idx}`}
          item={item}
          categoryName={category.categoryName}
        />
      ))}
    </VStack>
  );
}
