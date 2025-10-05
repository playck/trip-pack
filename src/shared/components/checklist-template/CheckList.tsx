import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { CategoryWithItems } from "@/features/packing/type";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import {
  backgrounds,
  borderColors,
  textColors,
} from "@/shared/constants/colors";

interface CheckListProps {
  categories: CategoryWithItems[];
}

export default function CheckList({ categories }: CheckListProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.name] || Package;

        return (
          <Box
            key={category.id}
            p={3}
            bg={backgrounds.muted}
            borderRadius="xl"
            border="1px"
            borderColor={borderColors.default}
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
                color="blue.500"
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
