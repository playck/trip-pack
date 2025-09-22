import { VStack, Text, Box } from "@chakra-ui/react";
import { useMemo } from "react";

import PackingItem from "./PackingItem";
import type { CategoryWithItems } from "../../type";

interface PackingItemListProps {
  category: CategoryWithItems;
  searchQuery?: string;
}

export default function PackingItemList({
  category,
  searchQuery = "",
}: PackingItemListProps) {
  const filteredItems = useMemo(() => {
    let items = [...category.items];

    if (searchQuery.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    return items;
  }, [category.items, searchQuery]);

  if (filteredItems.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="gray.500" fontSize="sm">
          {searchQuery.trim()
            ? `'${searchQuery}' 검색 결과가 없습니다`
            : "아이템이 없습니다"}
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3} align="stretch" pb="60px">
      {filteredItems.map((item, idx) => (
        <PackingItem
          key={item.id || `${item.name}-${idx}`}
          item={item}
          // categoryName={category.name}
        />
      ))}
    </VStack>
  );
}
