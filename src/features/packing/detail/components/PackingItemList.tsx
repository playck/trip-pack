import { VStack } from "@chakra-ui/react";
import PackingItem from "./PackingItem";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";

interface PackingItemListProps {
  category: GeneratedCheckList;
}

export default function PackingItemList({ category }: PackingItemListProps) {
  return (
    <VStack gap={3} align="stretch">
      {category.items.map((item, idx) => (
        <PackingItem
          key={`${item.name}-${idx}`}
          item={item}
          categoryName={category.categoryName}
        />
      ))}
    </VStack>
  );
}
