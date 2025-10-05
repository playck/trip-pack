import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { CategoryWithItems } from "@/features/packing/type";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";

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
            bg="gray.100"
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
          >
            <VStack gap={3} w="full">
              <Box
                w="12"
                h="12"
                bg="white"
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
                color="gray.700"
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
