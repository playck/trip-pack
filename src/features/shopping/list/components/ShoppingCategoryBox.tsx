import { useMemo } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { colors } from "@/shared/constants/colors";
import type { ShoppingCategoryWithItems } from "../../type";

interface ShoppingCategoryBoxProps {
  category: ShoppingCategoryWithItems;
  icon: LucideIcon;
  tripId: string;
}

export default function ShoppingCategoryBox({
  category,
  icon: Icon,
  tripId,
}: ShoppingCategoryBoxProps) {
  const navigate = useNavigate();

  const { checkedCount, progress } = useMemo(() => {
    const total = category.items.length;
    const checked = category.items.filter((i) => i.is_checked).length;
    return {
      checkedCount: checked,
      progress: total > 0 ? Math.round((checked / total) * 100) : 0,
    };
  }, [category.items]);

  const handleClick = () => {
    navigate({
      to: "/shopping/category/$tripId",
      params: { tripId },
      search: { categoryId: category.id },
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
      onClick={handleClick}
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
          color={`${colors.primary.palette}.500`}
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
                bg={`${colors.primary.palette}.500`}
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
