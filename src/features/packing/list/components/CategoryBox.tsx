import { Box, VStack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
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
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const getCategoryCheckedCount = useAtomValue(getCategoryCheckedCountAtom);
  const getCategoryProgress = useAtomValue(getCategoryProgressAtom);
  const checkedCount = getCategoryCheckedCount(category.categoryName);
  const progress = getCategoryProgress(category.categoryName);

  const handleCategoryClick = () => {
    try {
      navigate({
        to: "/packing/category/$tripId",
        params: { tripId },
        search: { category: category.categoryName },
      });
    } catch (error) {
      console.error("페이지 라우팅 오류:", error);
    }
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
