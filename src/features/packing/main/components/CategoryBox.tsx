import { Box, VStack, Text } from "@chakra-ui/react";
import { type GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";
import { type LucideIcon } from "lucide-react";

interface CategoryBoxProps {
  category: GeneratedCheckList;
  icon: LucideIcon;
}

export default function CategoryBox({
  category,
  icon: Icon,
}: CategoryBoxProps) {
  return (
    <Box
      bg="gray.100"
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      p={4}
      cursor="pointer"
    >
      <VStack gap={3}>
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
          {category.categoryName}
        </Text>
      </VStack>
    </Box>
  );
}
