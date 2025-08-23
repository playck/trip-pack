import { VStack, Box, Text, HStack, Badge } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

import type { CombinedCategory } from "./GridView";
import { CATEGORY_ICONS } from "../constants/category";

interface ListViewProps {
  categories: CombinedCategory[];
}

export default function ListView({ categories }: ListViewProps) {
  return (
    <VStack gap={4} align="stretch" w="full">
      {categories.map((category) => {
        // 사용자 정의 카테고리인 경우 iconKey 사용, 아니면 categoryName으로 매핑
        const iconKey =
          "iconKey" in category ? category.iconKey : category.categoryName;
        const IconComponent = CATEGORY_ICONS[iconKey] as LucideIcon;

        return (
          <VStack key={category.categoryName} gap={3} align="stretch">
            {/* 카테고리 헤더 */}
            <HStack justify="space-between" align="center">
              <HStack gap={1}>
                {IconComponent && <IconComponent size={18} color="#3182CE" />}
                <Text fontSize="md" fontWeight="semibold" color="gray.800">
                  {category.categoryName}
                </Text>
              </HStack>
              <Badge colorScheme="blue" size="sm">
                {category.items?.length || 0}개
              </Badge>
            </HStack>

            {/* 아이템 목록 - PackingItemList와 동일한 스타일 */}
            <VStack gap={3} align="stretch">
              {category.items && category.items.length > 0 ? (
                category.items.map((item: unknown, index: number) => (
                  <Box
                    key={index}
                    p={3}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    shadow="xs"
                  >
                    <Text fontSize="sm" color="gray.700">
                      {typeof item === "string"
                        ? item
                        : (item as { name?: string })?.name || "아이템"}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text fontSize="sm" color="gray.400" fontStyle="italic">
                  아이템이 없습니다
                </Text>
              )}
            </VStack>
          </VStack>
        );
      })}
    </VStack>
  );
}
