import { Box, HStack, Button } from "@chakra-ui/react";
import { componentColors } from "@/shared/constants/colors";

const SEARCH_CATEGORIES = [
  { label: "전체", value: "" },
  { label: "식당", value: "restaurant" },
  { label: "카페", value: "cafe" },
  { label: "관광지", value: "tourist_attraction" },
  { label: "숙소", value: "lodging" },
];

interface PlaceCategoryFilterListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function PlaceCategoryFilterList({
  selectedCategory,
  onSelectCategory,
}: PlaceCategoryFilterListProps) {
  return (
    <Box
      overflowX="auto"
      py={2}
      css={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <HStack gap={2} minW="max-content">
        {SEARCH_CATEGORIES.map((category) => (
          <Button
            key={category.value}
            size="xs"
            variant={selectedCategory === category.value ? "solid" : "outline"}
            bg={
              selectedCategory === category.value
                ? `${componentColors.button.primary}.500`
                : "transparent"
            }
            color={selectedCategory === category.value ? "white" : "gray.600"}
            borderColor={
              selectedCategory === category.value
                ? `${componentColors.button.primary}.500`
                : "gray.200"
            }
            _hover={{
              bg:
                selectedCategory === category.value
                  ? `${componentColors.button.primary}.600`
                  : "gray.50",
            }}
            onClick={() => onSelectCategory(category.value)}
            borderRadius="full"
            px={3}
          >
            {category.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
