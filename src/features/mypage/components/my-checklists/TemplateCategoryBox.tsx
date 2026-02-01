import { Box, VStack, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import type { CategoryWithItems } from "@/features/packing/type";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";

interface TemplateCategoryBoxProps {
  category: CategoryWithItems;
  icon: LucideIcon;
  isEditMode?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  onSelect?: () => void;
}

export default function TemplateCategoryBox({
  category,
  icon: Icon,
  isEditMode = false,
  isSelected = false,
  onClick,
  onSelect,
}: TemplateCategoryBoxProps) {
  const itemCount = category.items.length;

  const handleClick = () => {
    if (isEditMode && onSelect) {
      onSelect();
    } else {
      onClick();
    }
  };

  return (
    <Box
      p={3}
      bg="gray.100"
      borderRadius="xl"
      border="1px"
      borderColor={isSelected ? `${colors.primary.palette}.500` : "gray.200"}
      position="relative"
      cursor="pointer"
      onClick={handleClick}
    >
      {isEditMode && (
        <Box
          position="absolute"
          top={1}
          right={1}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            isChecked={isSelected}
            onChange={() => onSelect?.()}
            size="sm"
            colorScheme={colors.primary.palette}
          />
        </Box>
      )}

      <VStack gap={3} w="full">
        <Box
          w="12"
          h="12"
          bg="white"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="teal.500"
        >
          <Icon size={28} />
        </Box>
        <VStack gap={1} w="full">
          <Text
            fontSize="sm"
            fontWeight="medium"
            textAlign="center"
            color="gray.700"
          >
            {category.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {itemCount}개 아이템
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
