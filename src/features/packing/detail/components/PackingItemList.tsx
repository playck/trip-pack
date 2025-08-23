import { VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import PackingItem from "./PackingItem";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";
import { categoryItemsAtom } from "../../list/store/checklistAtom";

interface PackingItemListProps {
  category: GeneratedCheckList;
}

export default function PackingItemList({ category }: PackingItemListProps) {
  const categoryItems = useAtomValue(categoryItemsAtom);
  const currentCategory = categoryItems[category.categoryName] || category;

  return (
    <VStack gap={3} align="stretch">
      {currentCategory.items.map((item, idx) => (
        <PackingItem
          key={`${item.name}-${idx}`}
          item={item}
          categoryName={category.categoryName}
        />
      ))}
    </VStack>
  );
}
