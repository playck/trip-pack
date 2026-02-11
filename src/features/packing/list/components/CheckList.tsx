import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { CategoryWithItems } from "@/features/packing/type";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import { backgrounds, colors, textColors } from "@/shared/constants/colors";

interface CheckListProps {
  categories: CategoryWithItems[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

export default function CheckList({
  categories,
  selectedIds,
  onSelectionChange,
}: CheckListProps) {
  const handleCategoryClick = (category: CategoryWithItems) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(category.id)) {
      newSelectedIds.delete(category.id);
    } else {
      newSelectedIds.add(category.id);
    }
    onSelectionChange(newSelectedIds);
  };

  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.name] || Package;
        const isSelected = selectedIds.has(category.id);

        return (
          <Box
            key={category.id}
            p={3}
            bg={backgrounds.muted}
            borderRadius="xl"
            border="3px solid"
            borderColor={
              isSelected ? `${colors.primary.palette}.500` : "transparent"
            }
            transition="border-color 0.2s"
            cursor="pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <VStack gap={3} w="full">
              <Box
                w="12"
                h="12"
                bg={backgrounds.primary}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={`${colors.primary.palette}.500`}
              >
                <Icon size={28} />
              </Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                textAlign="center"
                color={textColors.secondary}
              >
                {category.name}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}
