import { Box, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { type LucideIcon } from "lucide-react";

import {
  getCategoryCheckedCountAtom,
  getCategoryProgressAtom,
} from "../store/checklistAtom";

type CategoryWithIcon = {
  categoryName: string;
  items: unknown[];
};

interface CategoryBoxProps {
  category: CategoryWithIcon;
  icon: LucideIcon;
}

export default function CategoryBox({
  category,
  icon: Icon,
}: CategoryBoxProps) {
  const navigate = useNavigate();
  const getCategoryCheckedCount = useAtomValue(getCategoryCheckedCountAtom);
  const getCategoryProgress = useAtomValue(getCategoryProgressAtom);
  const checkedCount = getCategoryCheckedCount(category.categoryName);
  const progress = getCategoryProgress(
    category.categoryName,
    category.items.length
  );

  const handleCategoryClick = () => {
    navigate({
      to: "/packing/category/$categoryName",
      params: { categoryName: encodeURIComponent(category.categoryName) },
    });
  };

  return (
    <Box
      p={3}
      bg="gray.100"
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      cursor="pointer"
      onClick={handleCategoryClick}
      _hover={{
        bg: "gray.200",
        transform: "translateY(-2px)",
        shadow: "lg",
      }}
      _active={{
        transform: "translateY(0px)",
      }}
      transition="all 0.2s"
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
        <VStack gap={2} w="full">
          <Text
            fontSize="sm"
            fontWeight="medium"
            textAlign="center"
            color="gray.700"
          >
            {category.categoryName}
          </Text>
          <VStack gap={1} w="full">
            <Box
              w="full"
              h="2"
              bg="gray.200"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="full"
                bg="blue.500"
                borderRadius="full"
                width={`${progress}%`}
                transition="width 0.3s ease"
              />
            </Box>
            <Text fontSize="xs" textAlign="right">
              {checkedCount} / {category.items.length}
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
