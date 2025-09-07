import { useMemo } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";

import type { CategoryWithItems } from "../../type";

interface CategoryBoxProps {
  category: CategoryWithItems;
  icon: LucideIcon;
}

export default function CategoryBox({
  category,
  icon: Icon,
}: CategoryBoxProps) {
  const navigate = useNavigate();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });

  const { checkedCount, progress } = useMemo(() => {
    const totalItems = category.items.length;
    const checkedItems = category.items.filter(
      (item) => item.is_checked
    ).length;
    const progressPercentage =
      totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    return {
      checkedCount: checkedItems,
      progress: progressPercentage,
    };
  }, [category.items]);

  const handleCategoryClick = () => {
    try {
      navigate({
        to: "/packing/category/$tripId",
        params: { tripId },
        search: { category: category.name },
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
            {category.name}
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
